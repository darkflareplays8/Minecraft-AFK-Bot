const mineflayer = require('mineflayer');

const config = {
  host: process.env.SERVER_HOST || 'DarkFlarePlays8.aternos.me',
  port: parseInt(process.env.SERVER_PORT || 37421),
  username: process.env.BOT_USERNAME || 'AFKBot2025',  // Normal username
  email: process.env.MC_EMAIL,      // Your Minecraft email
  password: process.env.MC_PASSWORD  // Your Minecraft password
};

let bot;
let attempts = 0;

function createBot() {
  console.log(`🔄 [${attempts + 1}] Joining ${config.host}:${config.port}`);
  
  const options = {
    host: config.host,
    port: config.port,
    username: config.username,
    version: false  // Auto 1.21.10
  };

  // Online mode auth
  if (config.email && config.password) {
    options.auth = 'microsoft';
    options.username = config.email;
  } else {
    options.auth = 'offline';
  }

  bot = mineflayer.createBot(options);

  bot.on('spawn', () => {
    attempts = 0;
    console.log('✅ SPAWNED - AFK ACTIVE (Public server)');
    
    // Stay out of way
    bot.chat('AFK Bot keeping server online!');
    
    setTimeout(afkMovement, 3000);
  });

  bot.on('error', err => {
    console.log(`❌ ${err.message}`);
    restart();
  });

  bot.on('kicked', reason => {
    console.log(`🚫 Kicked: ${reason}`);
    restart();
  });

  bot.on('end', () => {
    console.log('⛔️ Disconnected');
    restart();
  });
}

function restart() {
  if (attempts++ < 15) {
    setTimeout(createBot, 5000);
  }
}

let phase = 0;
function afkMovement() {
  if (!bot.entity) return setTimeout(afkMovement, 1000);
  
  // Reset controls
  bot.setControlState('forward', false);
  bot.setControlState('back', false);
  bot.setControlState('left', false);
  bot.setControlState('right', false);
  bot.setControlState('jump', false);
  
  // Random subtle movement
  const actions = ['forward', 'back', 'left', 'right'];
  const action = actions[phase % 4];
  bot.setControlState(action, true);
  
  console.log(`🎮 ${action.toUpperCase()}`);
  phase++;
  
  // Stop after 1s, wait 4s
  setTimeout(() => bot.clearControlStates(), 1000);
  setTimeout(afkMovement, 5000);
}

// Heartbeat
setInterval(() => console.log('💓 Bot alive'), 60000);

createBot();
