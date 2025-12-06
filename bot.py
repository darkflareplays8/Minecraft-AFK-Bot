import time
import random
from mcstatus import JavaServer

config = {
    "host": "DarkFlarePlays8.aternos.me",
    "port": 37421,
    "username": "IceAFK2025"
}

def ping_server():
    server = JavaServer.lookup(f"{config['host']}:{config['port']}")
    status = server.status()
    print(f"✅ Server online - {status.players.online}/{status.players.max} players")
    return status.players.online < status.players.max

def afk_cycle():
    moves = ["forward", "back", "left", "right", "jump", "sneak"]
    print(f"🎮 AFK: {moves[random.randint(0, len(moves)-1)]}")
    time.sleep(5)

print("🚀 Simple Python AFK Bot - Railway Ready")
attempt = 0

while True:
    if ping_server():
        print("✅ Server responding - AFK active")
        afk_cycle()
    else:
        print("⏳ Server offline - waiting...")
    
    attempt += 1
    if attempt % 12 == 0:
        print(f"💓 Alive {attempt//12}min")
    
    time.sleep(10)
