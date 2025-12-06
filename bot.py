import os
import time
import random
from mcstatus import JavaServer

# Railway environment variables
config = {
    "host": os.getenv('SERVER_HOST', 'DarkFlarePlays8.aternos.me'),
    "port": int(os.getenv('SERVER_PORT', 37421)),
    "username": os.getenv('BOT_USERNAME', 'IceAFK2025')
}

print(f"🚀 AFK Bot for {config['host']}:{config['port']}")

def ping_server():
    try:
        server = JavaServer.lookup(f"{config['host']}:{config['port']}")
        status = server.status()
        print(f"✅ Server UP - {status.players.online}/{status.players.max} players")
        return True
    except:
        print("⏳ Server offline - waiting...")
        return False

def afk_cycle():
    moves = ["WALK", "TURN", "JUMP", "SNEAK"]
    print(f"🎮 AFK: {random.choice(moves)}")
    time.sleep(5)

print("Starting infinite AFK loop...")
cycle = 0

while True:
    if ping_server():
        afk_cycle()
    time.sleep(10)  # Ping every 10s
    
    cycle += 1
    if cycle % 6 == 0:
        print(f"💓 Alive {cycle//6 * 1}min - Bot active!")
