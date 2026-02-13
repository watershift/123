
from fastapi import FastAPI, Header, HTTPException, Depends
import subprocess
import os

app = FastAPI()
AGENT_TOKEN = os.getenv("AGENT_TOKEN", "default-secret")

def verify_token(x_server_token: str = Header(None)):
    if x_server_token != AGENT_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid token")

@app.get("/health", dependencies=[Depends(verify_token)])
async def health():
    # Собираем метрики через системные вызовы
    cpu = os.popen("top -bn1 | grep 'Cpu(s)' | awk '{print $2}'").read().strip()
    peers = os.popen("wg show wg0 peers | wc -l").read().strip()
    return {
        "status": "ok",
        "cpu": float(cpu.replace(',', '.')),
        "peers": int(peers)
    }

@app.post("/peers", dependencies=[Depends(verify_token)])
async def add_peer(pubkey: str, allowed_ips: str):
    try:
        subprocess.run(["wg", "set", "wg0", "peer", pubkey, "allowed-ips", allowed_ips], check=True)
        return {"status": "created"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/peers/{pubkey}", dependencies=[Depends(verify_token)])
async def remove_peer(pubkey: str):
    try:
        subprocess.run(["wg", "set", "wg0", "peer", pubkey, "remove"], check=True)
        return {"status": "deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
