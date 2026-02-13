
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..models.server import Server, ServerStatus
import structlog

logger = structlog.get_logger()

class LoadBalancer:
    @staticmethod
    def allocate_server(db: Session, region: str = "europe") -> Server:
        """
        Атомарно выбирает и инкрементирует счетчик пиров на сервере.
        Использует PostgreSQL UPDATE ... RETURNING для исключения race condition.
        """
        sql = text("""
            UPDATE servers 
            SET current_peers = current_peers + 1 
            WHERE id = (
                SELECT id FROM servers 
                WHERE status = 'active' 
                AND region = :region 
                AND current_peers < max_peers 
                AND cpu_load < 85
                ORDER BY current_peers ASC 
                LIMIT 1 
                FOR UPDATE SKIP LOCKED
            ) 
            RETURNING *;
        """)
        
        result = db.execute(sql, {"region": region}).fetchone()
        
        if not result:
            logger.error("no_available_servers", region=region)
            return None
            
        return result

balancer = LoadBalancer()
