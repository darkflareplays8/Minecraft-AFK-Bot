// ✅ FIXED - 1.21.10 (Protocol 773)
const mc = require('minecraft-protocol');
const config = require('./config.json');

let client;
let reconnectAttempts = 0;

function connect() {
  console.log(`🔄 [${reconnectAttempts + 1}/10] ${config.host}:${config.port}`);
  
  client = mc.createClient({
    host: config.host,
    port: config.port,
    username: config.username,
    version: false,        // Auto-detect
    protocolVersion: 773,  // ✅ 1.21.10 EXACT
    keepAlive: true
  });

  client.on('login', () => {
    console.log('✅ CONNECTED - AFK Active');
    reconnectAttempts = 0;
    startAFK();
  });

  client.on('error', (err) => {
    console.log(`❌ ${err.message}`);
    reconnect();
  });

  client.on('end', () => {
    console.log('⛔️ DISCONNECTED');
    reconnect();
  });
}

function reconnect() {
  if (reconnectAttempts < 10) {
    reconnectAttempts++;
    setTimeout(connect, 3000 * reconnectAttempts);
  }
}

let phase = 0;
function startAFK() {
  if (!client) return;
  
  // Send keepalive + small movements
  client.write('keep_alive', { keepAliveId: Date.now() });
  
  const yaw = phase * 90;
  client.write('position_look', {
    x: 0, y: 0, z: 0,
    yaw: yaw * Math.PI / 180,
    pitch: 0,
    onGround: true
  });
  
  console.log(`🎮 Move ${phase % 4}`);
  phase++;
  setTimeout(startAFK, 5000); // 5s cycle
}

// Auto-start + heartbeat
setInterval(() => {
  if (!client) connect();
  console.log('💓 Alive');
}, 60000);

connect();
