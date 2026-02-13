
import datetime
import structlog
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..models.subscription import Subscription
from ..models.vpn_user import VPNUser
from ..models.server import Server, ServerStatus
from .agent_client import agent_client

logger = structlog.get_logger()

class PeerManager:
    async def remove_peer_safely(self, db: Session, profile: VPNUser):
        """
        1. Удаляет пира на физическом сервере через Агента.
        2. Атомарно уменьшает current_peers в БД.
        3. Деактивирует профиль.
        """
        server = db.query(Server).get(profile.server_id)
        if not server: return

        # Реальный вызов удаления на сервере
        success = await agent_client.remove_peer(server.ip, profile.public_key, server.agent_token)
        
        if success:
            # Атомарный декремент
            sql = text("UPDATE servers SET current_peers = current_peers - 1 WHERE id = :sid")
            db.execute(sql, {"sid": server.id})
            
            profile.is_active = False
            db.commit()
            logger.info("peer_removed_atomically", server=server.ip, user_id=profile.user_id)
        else:
            logger.error("peer_removal_failed_on_node", server=server.ip)

    def cleanup_expired_peers(self, db: Session):
        # Вызывается воркером: находит истёкшие, вызывает remove_peer_safely
        pass

peer_manager = PeerManager()
