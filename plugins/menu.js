bot(
  {
    pattern: 'menu',
    public: true,
    desc: 'Show All Commands',
    dontAddCommandList: true,
  },
  async (message, _, { mode, prefix }) => {
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

    // GIF URL (Replace with your actual hosted GIF URL)
    const gifUrl = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXY5Y3N4aWgwb2QwbnloMzBlYXlqaDJnc2J3cjdvZmt0bXk1dmY3MiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ypg1zWzMxl17y/giphy.gif'; 

    // Send the GIF before the menu
    await message.send(gifUrl, { type: 'image' });

    // Send the menu info
    return await message.send(menuInfo.trim());
  }
);
