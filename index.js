const Discord = require("discord.js");
const DiscordVoice = require("@discordjs/voice");
const fs = require('fs');
const { OpusEncoder } = require('@discordjs/opus');
const encoder = new OpusEncoder(48000, 2);
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
  ],
});
const CONFIG = require("./config.json");
const PREFIX = "!/";
client
  .login(CONFIG.token)
  .then(() => console.log(`${client.user.username} se ha conectado.`));
let voiceConnection;

client.on("messageCreate", (message) => {
  if (message.content.startsWith(PREFIX + "help")) {
    message.reply(`${PREFIX}join + nombrecanal1 + nombrecanal2 + nombrecanal3 -> Enlaza los canales para que el lider de party se le escuche\n
${PREFIX}disown -> Elimina el enlace de todos los canales enlazados`);
  }
  if (!voiceConnection) {
    voiceConnection = DiscordVoice.joinVoiceChannel({
      channelId: "677509972451655691",
      //group: "",
      guildId: "672555219443253289",
      selfDeaf: false,
      selfMute: false,
      adapterCreator: message.guild.voiceAdapterCreator,
    });
    const audio = voiceConnection.receiver.subscribe(message.author.id);
    let decode = encoder.decode(audio);
    fs.createWriteStream("./audio-test", decode);
  }
  if (message.content.startsWith(PREFIX + "leave")) {
      voiceConnection.destroy();
  }
});
