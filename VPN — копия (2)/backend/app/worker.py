
import asyncio
import structlog
from redis import Redis
from .db import SessionLocal
from .services.monitor import update_server_metrics
from .services.agent_client import agent_client
from .models.server import Server, ServerStatus
from .models.vpn_user import VPNUser
import os

logger = structlog.get_logger()
redis_client = Redis.from_url(os.getenv("REDIS_URL", "redis://redis:6379/0"))

async def monitor_loop():
    """Опрос здоровья серверов с порогом ошибок."""
    while True:
        db = SessionLocal()
        try:
            servers = db.query(Server).all()
            for server in servers:
                await update_server_metrics(server, db)
            db.commit()
        except Exception as e:
            logger.error("monitor_loop_error", error=str(e))
        finally:
            db.close()
        await asyncio.sleep(30)

async def reconciliation_job():
    """Сверка состояния WireGuard на нодах с БД (Fix Drift)."""
    while True:
        # Пытаемся захватить лок на 10 минут
        lock_key = "lock:reconciliation_job"
        if redis_client.set(lock_key, "active", ex=600, nx=True):
            logger.info("reconciliation_job_started")
            db = SessionLocal()
            try:
                servers = db.query(Server).filter(Server.status == ServerStatus.ACTIVE).all()
                for server in servers:
                    # Получаем реальный список пиров с ноды
                    try:
                        actual_peers = await agent_client.get_actual_peers(server.ip, server.agent_token)
                        db_peers = db.query(VPNUser).filter(VPNUser.server_id == server.id, VPNUser.is_active == True).all()
                        
                        db_keys = {p.public_key for p in db_peers}
                        
                        # 1. Если есть в БД, но нет на сервере -> восстановить
                        for p in db_peers:
                            if p.public_key not in actual_peers:
                                logger.warn("peer_missing_on_node_restoring", server=server.ip, user_id=p.user_id)
                                await agent_client.add_peer(server.ip, p.public_key, p.internal_ip, server.agent_token)
                        
                        # 2. Если есть на сервере, но нет в БД -> удалить (зомби)
                        for key in actual_peers:
                            if key not in db_keys:
                                logger.warn("zombie_peer_found_removing", server=server.ip, key=key[:10])
                                await agent_client.remove_peer(server.ip, key, server.agent_token)
                                
                    except Exception as e:
                        logger.error("node_reconciliation_failed", server=server.ip, error=str(e))
            finally:
                db.close()
                redis_client.delete(lock_key)
        await asyncio.sleep(600) # Раз в 10 минут

async def main():
    logger.info("background_worker_started")
    await asyncio.gather(
        monitor_loop(),
        reconciliation_job()
    )

if __name__ == "__main__":
    asyncio.run(main())
