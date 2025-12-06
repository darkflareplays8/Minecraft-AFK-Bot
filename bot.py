import socket
import time
import struct
import os

# Railway vars
HOST = os.getenv('SERVER_HOST', 'DarkFlarePlays8.aternos.me')
PORT = int(os.getenv('SERVER_PORT', 37421))

def send_server_ping():
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        sock.connect((HOST, PORT))
        
        # Minecraft Server List Ping (Protocol 773)
        handshake = struct.pack(
            '>cBBiB', 0x00, 0x04, 773, 0, 1  # Handshake + Status Request
        )
        sock.send(handshake + struct.pack('>i', len(handshake)))
        
        # Read response length
        pkt_len = struct.unpack('>i', sock.recv(4))[0]
        response = sock.recv(pkt_len)
        
        sock.close()
        print(f"✅ Pinged {HOST}:{PORT} - Server alive!")
        return True
        
    except:
        print(f"⏳ {HOST}:{PORT} unreachable")
        return False

print(f"🚀 Aternos TCP Pinger - {HOST}:{PORT}")
cycle = 0

while True:
    send_server_ping()
    time.sleep(30)  # Ping every 30s
    
    cycle += 1
    if cycle % 10 == 0:
        print(f"💓 Active {cycle * 30 // 60}min")
