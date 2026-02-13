
import paramiko
import structlog
import time

logger = structlog.get_logger()

class ProvisioningService:
    async def setup_node(self, host: str, token: str, retries: int = 3):
        """Idempotent setup of a new VPN node."""
        logger.info("provisioning_started", host=host)
        
        for attempt in range(retries):
            try:
                client = paramiko.SSHClient()
                client.set_missing_host_key_policy(paramiko.RejectPolicy())
                # В проде использовать SSH ключи из секрета
                client.connect(host, username="root", timeout=15)

                # Шаг 1: Проверка установлен ли WireGuard (Идемпотентность)
                stdin, stdout, stderr = client.exec_command("which wg")
                if stdout.channel.recv_exit_status() != 0:
                    logger.info("step_installing_wg", host=host)
                    client.exec_command("apt-get update && apt-get install -y wireguard iptables")

                # Шаг 2: Проверка Forwarding
                client.exec_command("sysctl -w net.ipv4.ip_forward=1")

                # Шаг 3: Настройка агента
                # Проверяем, запущен ли агент
                stdin, stdout, stderr = client.exec_command("pgrep -f vpn_agent")
                if stdout.channel.recv_exit_status() != 0:
                    logger.info("step_starting_agent", host=host)
                    # (Логика копирования и запуска vpn_node_agent)
                    pass

                client.close()
                logger.info("provisioning_success", host=host)
                return True
            except Exception as e:
                logger.error("provisioning_attempt_failed", host=host, attempt=attempt+1, error=str(e))
                time.sleep(5)
        
        return False

provisioner = ProvisioningService()
