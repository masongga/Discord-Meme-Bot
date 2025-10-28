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
client.on("messageCreate", async (msg) => {
  console.log(`Message received: ${msg.content}`);

  if (msg.content === "meme") {
    const meme = await getMeme(1);
    msg.reply(meme.memes[0].url);
  }
});

const memeTime = {
  hour: 3,
  minute: 0,
};
const channelId = process.env.CHANNEL_ID;
const MEME_COUNT = 7;
const spamLimit = 45;

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
