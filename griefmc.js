require('dotenv').config() // Load .env file
const axios = require('axios')
const Discord = require('discord.js')
const client = new Discord.Client()
var authprefix = process.env.BOTPREFIX
var authowner = process.env.BOTOWNER
var env_vh_token = process.env.BOTTOKEN
var apidomain = process.env.APIDOMAIN
var ip = process.env.GRIEFMC_IP
var port = process.env.GRIEFMC_PORT

async function multipleReact(message, arr) {
    if (arr !== []) {
        await message.react(arr.shift()).catch(console.error).then(function () {multipleReact(message,arr).catch(console.error);});
    }
}

function pingForPlayers() {

	// Ping API for server data.
	axios.get(`https://${apidomain}/1/${ip}${port}`).then(res => {
		// If we got a valid response
		if(res.data && res.data.players) {
			let playerCount = res.data.players.online || 0 // Default to zero
			client.user.setPresence({
				game: {
					// Example: "Watching 5 players on server.com"
					name: `g!about`,
					type: 3 // Use activity type 3 which is "Watching"
				}
			})
			console.log('Updated player count to', playerCount)
		}
		else
			console.log('Could not load player count data for', process.env.GRIEFMC_IP)

	}).catch(err => console.log('Error pinging api.mcsrvstat.us for data:', err))
}

// Runs when client connects to Discord.

client.on("message", async message => {
	if (message.channel.id === '424634328946049025') {
        console.log('caught '+message.id);
        return multipleReact(message, ['424635897363824640', '424635921158242307']).catch();
    }
  if(message.author.bot) return;
  if(message.content.indexOf(authprefix) !== 0) return;
  const args = message.content.slice(authprefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
    if(command === "online") {
		// Ping API for server data.
	axios.get(`https://${apidomain}/1/${ip}${port}`).then(res => {
		// If we got a valid response
		if(res.data && res.data.players) {
let players = res.data.players.list
			let playerCount = res.data.players.online || 0 // Default to zero
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
		        const embed = new Discord.RichEmbed()
                .setTitle(`g!about`)
                .setFooter("GRIEFMC")
                .setDescription(`${playerCount} из 1000 игроков на сервере play.grmc.su\n\n${players}`);
            message.channel.send({embed});
    }
	})
	}
	if(command === "about") {
	        const embed = new Discord.RichEmbed()
                .setTitle(`Обо мне:`)
                .setFooter("GRIEFMC")
                .setDescription('Данного бота сделал [SPONSOR] DipperProdYT (<@' + authowner + '>)\nБот не подтвержён сервером GRIEFMC, это чисто разработка игрока.\n\nhttps://grmc.su | Copyright by [TheDipperProduction](https://withdipper.tk)\n\nКоманды:\n```fix\ng!serverinfo - что такое GRIEFMC?\ng!online - узнать кто на сервере\ng!avatar [@mention] - аватарка пользователя (сделал чисто по фану)\n```\n\nДобавить его к себе - [тык, ;3](https://discordapp.com/oauth2/authorize?client_id=427154671048589322&scope=bot&permissions=67128449)');
            message.channel.send({embed});
	}
	if(command === "serverinfo") {
	        const embed = new Discord.RichEmbed()
                .setTitle(`Что такое GRIEFMC?`)
                .setFooter("GRIEFMC")
                .setDescription('GRIEFMC - это Minecraft проект, созданный на пользу игрокам.\nНа нём можно взрывать ТНТ, спавнить криперов и т.д (ну вообщем, сервер где всё можно).\n\nАдминистратор: __  __MrSplash__  __ (Discord ID: <@224205286636912640>)\nМодератор: NuclearRuralLamp (Discord ID: <@245528104750022656>)\nСайт: [тык, ;3](https://grmc.su)\nГруппа ВК: [тык, ;3](https://vk.com/griefmc)');
            message.channel.send({embed});
	}
	if(command === "status") {
		if(message.author.id !== authowner) return;
		const sayStatus = args.join(" ");
		client.user.setPresence({ game: { name: sayStatus, type: 3 } }).catch();
		message.channel.send('[GRIEFMC] Статус изменён:\n```fix\nСмотрит ' + status + '\n```');
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
if (command === "cmd_eval") {
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

	pingForPlayers() // Ping server once on startup
	// Ping the server and set the new status message every x minutes. (Minimum of 1 minute)
	setInterval(pingForPlayers, Math.max(1, 1 || 1) * 60 * 1000)
})

// Login to Discord
client.login(env_vh_token)
