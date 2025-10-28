require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

//meme api
async function getMeme() {
  console.log("Fetching meme...");
  const api = await fetch("https://meme-api.com/gimme");
  const data = await api.json();
  console.log("Meme data: ", data);
  return data;
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// connection to discord
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//return pong if "ping" is sent
client.on("messageCreate", async (msg) => {
  console.log(`Message received: ${msg.content}`);

  if (msg.content === "ping") {
    const meme = await getMeme();
    msg.reply(meme.url);
  }
});

//discord bot token
client.login(process.env.DISCORD_TOKEN);
