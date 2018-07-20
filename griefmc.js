const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  client.user.setStatus('g!h');
});

client.on('message', message => {
  if(message.content === "g!h") {
    message.channel.send({embed: {
    title: "Проект обновляется",
    description: "На данный момент, проект GRIEFMCBOT обновляется, следите за новостями в группе ВК: [https://vk.com/sqdeclipse_group](https://vk.com/sqdeclipse_group)\n\nРазработчик: [DipperProdYT](http://eclipsedev.cf) (донатер, тестер GRIEFMC)\nGRIEFMC: [https://grmc.su](https://grmc.su)"
}
});
}
});

client.login(process.env.BOTTOKEN);
