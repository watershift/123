
#!/bin/bash
# Setup WireGuard interface wg0
INTERFACE="wg0"
PORT=51820
PRIVATE_KEY=$(wg genkey)
PUBLIC_KEY=$(echo $PRIVATE_KEY | wg pubkey)

cat <<EOF > /etc/wireguard/$INTERFACE.conf
[Interface]
PrivateKey = $PRIVATE_KEY
Address = 10.0.0.1/24
ListenPort = $PORT
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
EOF

wg-quick up $INTERFACE
echo "WireGuard setup complete. Public Key: $PUBLIC_KEY"
