const mc = require('minecraft-protocol');
const config = require('./config.json');

let client;
let reconnectAttempts = 0;

function connect() {
  console.log(`🔄 Connect ${reconnectAttempts + 1}: ${config.host}:${config.port}`);
  
  client = mc.createClient({
    host: config.host,
    port: config.port,
    username: config.username,
    version: '1.21.1',  // Fixed version
    keepAlive: true
  });

  client.on('login', () => {
    console.log('✅ LOGGED IN - AFK Active');
    reconnectAttempts = 0;
    startAFK();
  });

  client.on('error', (err) => {
    console.log(`❌ ${err.code || err.message}`);
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
    setTimeout(connect, 5000 * reconnectAttempts);
  }
}

let phase = 0;
function startAFK() {
  const actions = [
    () => client.write('position', { x: 0, y: 0, z: 0, yaw: 0, pitch: 0, onGround: true }),
    () => client.write('player', { actionId: 0, onGround: true }),  // Start sneaking
    () => client.write('player', { actionId: 1, onGround: true }),  // Stop sneaking
    () => client.write('position_look', { x: 0, y: 0, z: 0, yaw: phase * 90, pitch: 0, onGround: true })
  ];
  
  actions[phase % 4]();
  console.log(`🎮 Phase ${phase % 4}`);
  phase++;
  
  setTimeout(startAFK, 3000);
}

// Keepalive
setInterval(() => client?.write('keep_alive', { keepAliveId: Date.now() }), 5000);

connect();
console.log('🚀 Custom AFK Bot Started');
