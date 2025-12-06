const mineflayer = require('mineflayer');
const config = {
  host: process.env.SERVER_HOST || 'DarkFlarePlays8.aternos.me',
  port: parseInt(process.env.SERVER_PORT || 37421),
  username: process.env.BOT_USERNAME || 'IceAFK2025'
};

let bot;
let attempts = 0;

function createBot() {
  console.log(`🔄 Attempt ${attempts + 1}: ${config.host}:${config.port}`);
  
  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    auth: 'offline',
    version: false,  // Auto-detect 1.21.10
    hideErrors: false
  });

  bot.on('spawn', () => {
    attempts = 0;
    console.log('✅ JOINED SERVER - AFK STARTED!');
    
    bot.chat('/op IceAFK2025');  // Self-op
    setTimeout(afkLoop, 2000);
  });

  bot.on('error', err => {
    console.log(`❌ ${err.message}`);
    restart();
  });

  bot.on('end', () => {
    console.log('⛔️ DISCONNECTED');
    restart();
  });
}

function restart() {
  if (attempts < 20) {
    attempts++;
    setTimeout(createBot, 5000 * Math.min(attempts, 3));
  }
}

let phase = 0;
function afkLoop() {
  if (!bot.entity) return setTimeout(afkLoop, 1000);
  
  // Random human-like movement
  const moves = [
    () => bot.setControlState('forward', true),
    () => bot.setControlState('back', true),
    () => bot.setControlState('left', true),
    () => bot.setControlState('right', true),
    () => bot.jump()
  ];
  
  // Reset previous
  bot.clearControlStates();
  moves[phase % 5]();
  
  console.log(`🎮 Move ${phase % 5}`);
  phase++;
  
  setTimeout(() => {
    bot.clearControlStates();
    setTimeout(afkLoop, 3000);
  }, 500);
}

// Start
createBot();
setInterval(() => console.log('💓 Alive'), 30000);
