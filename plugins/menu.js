import { font } from '#lib';
import { config } from '#config';
import { bot, commands } from '#src';
import { formatBytes, getRandom, runtime } from '#utils';
import { platform, totalmem, freemem } from 'os';

bot(
  {
    pattern: 'menu',
    public: true,
    desc: 'Show All Commands',
    dontAddCommandList: true,
  },
  async (message, _, { mode, prefix }) => {
    try {
      const cmds = commands.filter(
        (cmd) =>
          cmd.pattern && !cmd.dontAddCommandList && !cmd.pattern.toString().includes('undefined')
      ).length;

      let menuInfo = `\`\`\`
╭─── ${config.BOT_INFO.split(';')[1]} ────
│ Prefix: ${getRandom(prefix)}
│ Owner: ${config.BOT_INFO.split(';')[0]}		
│ Plugins: ${cmds}
│ Mode: ${mode ? 'Private' : 'Public'}
│ Uptime: ${runtime(process.uptime())}
│ Platform: ${platform()}
│ Ram: ${formatBytes(totalmem() - freemem())}
│ Day: ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}
│ Date: ${new Date().toLocaleDateString('en-US')}
│ Time: ${new Date().toLocaleTimeString('en-US', { timeZone: config.TIME_ZONE })}
│ Version: ${config.VERSION}
╰─────────────\`\`\`\n`;

      const commandsByType = commands
        .filter((cmd) => cmd.pattern && !cmd.dontAddCommandList)
        .reduce((acc, cmd) => {
          const type = cmd.type || 'Misc';
          if (!acc[type]) {
            acc[type] = [];
          }
          acc[type].push(cmd.pattern.toString().toLowerCase().split(/\W+/)[2]);
          return acc;
        }, {});

      const sortedTypes = Object.keys(commandsByType).sort();
      let totalCommands = 1;

      sortedTypes.forEach((type) => {
        const sortedCommands = commandsByType[type].sort();
        menuInfo += font.tiny(`╭──── *${type}* ────\n`);
        sortedCommands.forEach((cmd) => {
          menuInfo += font.tiny(`│${totalCommands}· ${cmd}\n`);
          totalCommands++;
        });
        menuInfo += font.tiny(`╰────────────\n`);
      });

      // GIF URL (Replace with actual hosted GIF)
      const gifUrl = 'https://media.giphy.com/media/3o7abldj0b3rxrZUxW/giphy.gif';

      // Send the GIF before the menu
      await message.send(gifUrl, { type: 'image' });

      // Send the menu text
      return await message.send(menuInfo.trim());
    } catch (error) {
      console.error('Error in menu command:', error);
      return await message.reply('❌ Error loading the menu. Please try again later.');
    }
  }
);
