const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  client.user.setStatus('g!h');
});

client.on('message', message => {
  if(message.content === "g!h") {
    message.channel.send({embed: {
    title: "Проект больше не обновляется",
    description: "Проект закрыт и больше не будет обновляться, а ибо зачем быть боту который даже не популярен среди игроков GRIEFMC?\n\nРазработчик: [DipperProdYT](http://eclipsedev.cf) (донатер, тестер GRIEFMC)\nGRIEFMC: [https://grmc.su](https://grmc.su)"
}
});
}
});

client.login(process.env.BOTTOKEN);
