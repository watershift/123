
import asyncio
import httpx
import datetime
from sqlalchemy.orm import Session
from ..models.server import Server, ServerStatus
from ..db import SessionLocal
import structlog

logger = structlog.get_logger()

RETRY_THRESHOLD = 3 # Перевод в DOWN только после 3-х неудач

async def update_server_metrics(server: Server, db: Session):
    """
    Защищенный опрос агента ноды.
    """
    url = f"https://{server.ip}:8080/health" # Используем HTTPS
    headers = {"X-Server-Token": server.agent_token}
    
    try:
        async with httpx.AsyncClient(timeout=5.0, verify=False) as client: # verify=False для self-signed в VPN
            response = await client.get(url, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                server.cpu_load = data.get("cpu", 0.0)
                server.current_peers = data.get("peers", 0)
                server.fail_count = 0
                server.last_check_at = datetime.datetime.utcnow()
                
                if server.status == ServerStatus.DOWN:
                    server.status = ServerStatus.ACTIVE
                    logger.info("server_recovered", host=server.ip)
            else:
                raise Exception(f"Agent returned {response.status_code}")
                
    except Exception as e:
        server.fail_count += 1
        logger.warn("health_check_failed", host=server.ip, fails=server.fail_count, error=str(e))
        
        if server.fail_count >= RETRY_THRESHOLD and server.status == ServerStatus.ACTIVE:
            server.status = ServerStatus.DOWN
            logger.error("server_marked_down", host=server.ip)
