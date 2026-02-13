
from pydantic import BaseModel, IPvAnyAddress
from typing import Optional
from ..models.server import ServerStatus

class ServerCreate(BaseModel):
    name: str
    ip: IPvAnyAddress
    region: str = "europe"
    max_peers: int = 500
    ssh_user: str = "root"

class ServerResponse(BaseModel):
    id: int
    name: str
    ip: str
    status: ServerStatus
    current_peers: int
    cpu_load: float

    class Config:
        from_attributes = True
