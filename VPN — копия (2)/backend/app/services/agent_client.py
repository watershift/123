
import httpx
import structlog

logger = structlog.get_logger()

class NodeAgentClient:
    def __init__(self, token: str):
        self.token = token

    async def add_peer(self, server_ip: str, pubkey: str, internal_ip: str):
        url = f"http://{server_ip}:8080/peers"
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, json={
                "public_key": pubkey,
                "allowed_ips": internal_ip
            }, headers={"Authorization": f"Bearer {self.token}"})
            return resp.status_code == 201

    async def remove_peer(self, server_ip: str, pubkey: str):
        url = f"http://{server_ip}:8080/peers/{pubkey}"
        async with httpx.AsyncClient() as client:
            resp = await client.delete(url, headers={"Authorization": f"Bearer {self.token}"})
            return resp.status_code == 200

agent_client = NodeAgentClient(token="node-secret-token")
