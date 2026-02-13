
import subprocess
import os

class WireGuardService:
    @staticmethod
    def generate_key_pair():
        private_key = subprocess.check_output(["wg", "genkey"]).decode("utf-8").strip()
        public_key = subprocess.check_output(["wg", "pubkey"], input=private_key.encode()).decode("utf-8").strip()
        return private_key, public_key

    @staticmethod
    def create_client_config(server_ip, server_pubkey, client_privkey, client_ip, port=51820):
        config = f"""
[Interface]
PrivateKey = {client_privkey}
Address = {client_ip}/32
DNS = 1.1.1.1

[Peer]
PublicKey = {server_pubkey}
Endpoint = {server_ip}:{port}
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 20
"""
        return config

    def add_peer_to_server(self, server_interface, client_pubkey, client_ip):
        # In production, this would use SSH or a local agent on the server
        # For local dev, we assume we are on the server
        try:
            subprocess.run([
                "wg", "set", server_interface, 
                "peer", client_pubkey, 
                "allowed-ips", f"{client_ip}/32"
            ], check=True)
            return True
        except Exception as e:
            print(f"Error adding peer: {e}")
            return False

vpn_service = WireGuardService()
