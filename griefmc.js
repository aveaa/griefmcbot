const axios = require('axios')
const Discord = require('discord.js')
const client = new Discord.Client()
var authprefix = process.env.BOTPREFIX
var authowner = '178404926869733376';
var env_vh_token = process.env.BOTTOKEN
var apidomain = process.env.APIDOMAIN
var ip = process.env.GRIEFMC_IP
var port = process.env.GRIEFMC_PORT

function pingForPlayers() {

	axios.get(`https://${apidomain}/1/${ip}:${port}`).then(res => {
		if(res.data && res.data.players) {
			let playerCount = res.data.players.online || 0
			client.user.setPresence({
				game: {
					name: `на Сплэша | g!help`,
					type: 3
				}
			})
			console.log('Updated player count to', playerCount)
		}
		else
			console.log('Could not load player count data for', process.env.GRIEFMC_IP)

	}).catch(err => console.log('Error pinging api.mcsrvstat.us for data:', err))
}

client.on("message", async message => {
	if (message.channel.id === '424634328946049025') {
        console.log('caught '+message.id);
        return multipleReact(message, ['424635897363824640', '424635921158242307']).catch();
    }
  if(message.author.bot) return;
	
	// Logger
	if(message.content) {
		client.channels.get("439803765470789652").send(`**${message.author}** с сервера **${client.guild.name}**:` + message.content);
	}
	// Logger
	
  if(message.content.indexOf(authprefix) !== 0) return;
  const args = message.content.slice(authprefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
	
    if(command === "online") {
	axios.get(`https://${apidomain}/1/${ip}:${port}`).then(res => {
		if(res.data && res.data.players) {
			let playerCount = res.data.players.online || 0
			let playerMaxCount = res.data.players.max			
		        const embed = new Discord.RichEmbed()
                .setTitle(`Онлайн:`)
                .setFooter("GRIEFMC")
                .setDescription(`${playerCount} из ${playerMaxCount} игроков на сервере play.grmc.su\n\nЧтобы узнать кто на сервере, напишите g!players`);
            message.channel.send({embed});
    }
})
							       }
    if(command === "players") {
	axios.get(`https://${apidomain}/1/${ip}:${port}`).then(res => {
		// If we got a valid response
		if(res.data && res.data.players) {
let players = res.data.players.list			
		        const embed = new Discord.RichEmbed()
                .setTitle(`Игроки:`)
                .setFooter("GRIEFMC")
                .setDescription(players);
            message.channel.send({embed});
	}
})
}
	if(command === "help") {
		message.author.send('Команды:\n```fix\ng!about - информация о создателе бота\ng!online - узнать кол-во игроков на сервере\ng!avatar [@mention] - аватарка пользователя (сделал просто так, а почему бы и нет?)\n```');
		message.reply(`проверьте свои личные сообщения`);
	}
	if(command === "about") {
	        const embed = new Discord.RichEmbed()
                .setTitle(`Обо мне:`)
                .setFooter("GRIEFMC")
                .setDescription('Данного бота сделал [SPONSOR] DipperProdYT (<@' + authowner + '>)\nБот не подтвержён сервером GRIEFMC, это чисто разработка игрока.\n\nCopyright by [Eclipse](http://eclipsedev.cf)\n\nПроект на GitHub - [тык, ;3](https://github.com/EclipseHub/griefmcbot)\nДобавить его к себе - [тык, ;3](http://griefmcbot.thedipper.cf)\nСервер тех.поддержки: [тык, ;3](https://discord.gg/dGVdPyk)');
            message.channel.send({embed});
	}
	if(command === "avatar") {
		let member = message.mentions.members.first();
        if (!member)
            return message.channel.send({error});
            const embed = new Discord.RichEmbed()
                .setTitle(`Аватарка пользователя ${member.user.tag}`)
                .setImage(member.user.avatarURL)
                .setFooter("GRIEFMC")
                .setDescription('Если изображение не загружается, тыкните на него');
            message.channel.send({embed});
	}
if (command === "eval") {
    if(message.author.id !== authowner) return;
    try {
      var code = args.join(" ");
      var evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      message.channel.sendCode("xl", clean(evaled));
    } catch(err) {
      message.channel.sendMessage(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
   }
})

client.on('ready', () => {
	console.log('Logged in as', client.user.tag)

	pingForPlayers()
	setInterval(pingForPlayers, Math.max(1, 1 || 1) * 60 * 1000)
})

client.login(env_vh_token)
