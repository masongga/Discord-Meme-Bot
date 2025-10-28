require("dotenv").config();
const { Client, GatewayIntentBits, AttachmentBuilder } = require("discord.js");
const cron = require("node-cron");

//meme api
async function getMeme(memeCount = 1) {
  console.log("Fetching meme...");
  const api = await fetch(`https://meme-api.com/gimme/${memeCount}`);
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

//return meme if "meme" is sent
const memeTime = {
  hour: 16,
  minute: 58,
};
const channelId = process.env.CHANNEL_ID;
const MEME_COUNT = 1;
const spamLimit = 5;

client.on("messageCreate", async (msg) => {
  console.log(`Message received: ${msg.content}`);

  if (msg.content === "meme") {
    const meme = await getMeme(1);
    msg.reply(meme.url);
  }
});

//spam memes at 3:00am
client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log("Current time: " + new Date().toLocaleTimeString());

  cron.schedule(`${memeTime.minute} ${memeTime.hour} * * *`, async () => {
    console.log("MEME'O'CLOCK...");

    const channel = client.channels.cache.get(channelId);

    for (let i = 0; i < spamLimit; i++) {
      const meme = await getMeme(MEME_COUNT);
      if (channel) {
        const memeUrls = meme.memes.map((meme) => meme.url);

        await channel.send({
          content: "@everyone",
          files: memeUrls,
        });
      }
      await new Promise((resolve) => setTimeout(resolve, 30000));
    }
    console.log("Meme's delivered successfully.");
  });
});

//discord bot token
client.login(process.env.DISCORD_TOKEN);
