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
│const gifUrl = 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZW5mNDY5YTYwamRkZnJxb2c1dWlsc3l2M3F1eWRnMnZ5bXh2aDBoZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ypg1zWzMxl17y/giphy.gif';
│Prefix: ${getRandom(prefix)}
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

      // GIF URL
     

      // Send the GIF first
      await message.send({ image: { url: gifUrl }, caption: "Here's the menu! 📜" });

      // Send the menu text
      return await message.send(menuInfo.trim());
    } catch (error) {
      console.error('Error in menu command:', error);
      return await message.reply('❌ Error loading the menu. Please try again later.');
    }
  }
);
