'use strict';

const config = require('./config');

const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } = require('discord.js');
const { createAudioPlayer, joinVoiceChannel, createAudioResource } = require('@discordjs/voice');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });
const player = createAudioPlayer();

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'yt',
    description: 'Play music from YouTube!',
    options: [
      {
        name: "url",
        description: "YouTube url",
        type: 3,
        required: true
      }
    ],
  },
  {
    name: 'play',
    description: 'Play music from YouTube!',
    options: [
      {
        name: "url",
        description: "YouTube url",
        type: 3,
        required: true
      }
    ],
  },
  {
    name: 'music',
    description: 'Play music from YouTube!',
    options: [
      {
        name: "url",
        description: "YouTube url",
        type: 3,
        required: true
      }
    ],
  },
  {
    name: 'queue',
    description: 'Play music from YouTube!',
    options: [
      {
        name: "url",
        description: "YouTube url",
        type: 3,
        required: true
      }
    ],
  },
  {
    name: 'melody',
    description: 'Play music from YouTube!',
    options: [
      {
        name: "url",
        description: "YouTube url",
        type: 3,
        required: true
      }
    ],
  },
  {
    name: 'stop',
    description: 'Stop play music from YouTube!',
  },
];

const rest = new REST({ version: '10' }).setToken(config.discordBotToken);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(config.discordClientId), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }

  if (interaction.commandName === 'stop') {
    player.stop();
  }

  if (interaction.commandName === 'yt' ||
      interaction.commandName === 'play' ||
      interaction.commandName === 'music' ||
      interaction.commandName === 'queue'
    ) {

    await goMelody(interaction);

  }

});

client.login(config.discordBotToken);


async function goMelody(interaction) {

  if (!interaction.member.voice.channel) {
    return interaction.reply("Лева попа, зайди в канал");
  }

  const url = interaction.options.getString("url")

  console.log('melodyStream')
  const melodyStream = ytdl(url, {
    filter: 'audioonly',
    quality: 'highestaudio',
    highWaterMark: 1 << 25
  });

  console.log('ffmpeg')
  const ffmpegMeloding = ffmpeg(melodyStream)
    .withAudioCodec('libmp3lame')
    .toFormat('mp3')

  console.log('createAudioResource')
  const resource = createAudioResource(ffmpegMeloding, {
    inlineVolume: true
  });
  resource.volume.setVolume(0.15);

  const connection = joinVoiceChannel({
    channelId: interaction.member.voice.channel.id,
    guildId: interaction.member.voice.channel.guild.id,
    adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
  });

  player.play(resource);
  connection.subscribe(player)

  let embed = new EmbedBuilder()
  embed
    .setDescription(`**${url}**`)

  await interaction.reply({
      embeds: [embed]
  })
  
}
