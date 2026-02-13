
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..db import get_db
from ..core.security import admin_required
from ..models.server import Server, ServerStatus
from ..models.user import User
from ..models.payment import Payment
from ..schemas.server import ServerCreate, ServerResponse
import structlog
import uuid
from sqlalchemy import func

router = APIRouter()
logger = structlog.get_logger()

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db), _ = Depends(admin_required)):
    """Сбор статистики для дашборда."""
    total_revenue = db.query(func.sum(Payment.amount)).filter(Payment.status == "completed").scalar() or 0
    total_users = db.query(User).count()
    active_servers = db.query(Server).filter(Server.status == ServerStatus.ACTIVE).count()
    
    # Расчет средней нагрузки
    avg_load = db.query(func.avg(Server.cpu_load)).filter(Server.status == ServerStatus.ACTIVE).scalar() or 0
    
    return {
        "total_revenue": total_revenue,
        "total_users": total_users,
        "active_servers": active_servers,
        "network_load": round(avg_load, 1)
    }

@router.get("/servers", response_model=list[ServerResponse])
def list_servers(db: Session = Depends(get_db), _ = Depends(admin_required)):
    return db.query(Server).all()

@router.delete("/servers/{server_id}")
def delete_server(server_id: int, db: Session = Depends(get_db), _ = Depends(admin_required)):
    server = db.query(Server).get(server_id)
    if not server: raise HTTPException(status_code=404)
    if server.current_peers > 0:
        raise HTTPException(status_code=400, detail="Cannot delete server with active peers. Drain it first.")
    
    db.delete(server)
    db.commit()
    logger.info("server_deleted", admin_id="current", server_ip=server.ip)
    return {"status": "deleted"}

@router.post("/servers", response_model=ServerResponse)
async def create_server(data: ServerCreate, db: Session = Depends(get_db), _ = Depends(admin_required)):
    # Генерируем уникальный токен агента
    agent_token = uuid.uuid4().hex
    
    new_server = Server(
        name=data.name,
        ip=str(data.ip),
        region=data.region,
        max_peers=data.max_peers,
        agent_token=agent_token,
        status=ServerStatus.MAINTENANCE
    )
    db.add(new_server)
    db.commit()
    db.refresh(new_server)
    
    logger.info("admin_added_server", ip=new_server.ip, region=new_server.region)
    return new_server
