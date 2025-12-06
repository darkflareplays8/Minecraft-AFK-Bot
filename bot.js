const mineflayer = require('mineflayer');

const config = {
  host: process.env.SERVER_HOST || 'DarkFlarePlays8.aternos.me',
  port: parseInt(process.env.SERVER_PORT || 37421),
  username: process.env.BOT_USERNAME || 'AFKBot2025'
};

let bot;
let attempts = 0;

function createBot() {
  console.log(`🔄 [${attempts + 1}] ${config.host}:${config.port}`);
  
  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    auth: 'offline',
    version: '1.20.6',  // ✅ SUPPORTED = Protocol 767
    viewDistance: 4
  });

  bot.on('spawn', () => {
    attempts = 0;
    console.log('✅ SPAWNED - AFK ACTIVE!');
    bot.chat('AFK Bot online!');
    afkLoop();
  });

  bot.on('error', err => {
    console.log(`❌ ${err.message}`);
    restart();
  });

  bot.on('end', () => {
    console.log('⛔️ DC');
    restart();
  });
}

function restart() {
  if (attempts++ < 10) setTimeout(createBot, 3000);
}

let phase = 0;
function afkLoop() {
  if (!bot.entity) return setTimeout(afkLoop, 1000);
  
  bot.clearControlStates();
  
  const moves = ['forward', 'back', 'left', 'right'];
  bot.setControlState(moves[phase % 4], true);
  
  console.log(`🎮 ${moves[phase % 4]}`);
  phase++;
  
  setTimeout(() => {
    bot.clearControlStates();
    setTimeout(afkLoop, 4000);
  }, 800);
}

createBot();
setInterval(() => console.log('💓 Alive'), 30000);
