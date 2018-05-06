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
  if(message.author.bot) return;
	
  if(message.content.indexOf(authprefix) !== 0) return;
  const args = message.content.slice(authprefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
	
	if(command === "moderator") {
		message.channel.send(`Алекс Линкс прибыл. хдд\n\ng!ban [@упоминание] [причина] - забанить пользователя\ng!kick [@упоминание] [причина] - кикнуть пользователя`);
	}
	
	if(command === "uptime") {
		const embed = new Discord.RichEmbed()
            .setTitle(`Статистика бота ` + client.user.tag)
            .setThumbnail(client.user.avatarURL);
            embed.addField('Пинг:', client.ping);
            embed.addField('Память (ОЗУ):', process.env.WEB_MEMORY + 'MB / ' + process.env.MEMORY_AVAILABLE + 'MB');
            embed.addField('Сервер:', process.env.DYNO);
            embed.addField('Порт:', process.env.PORT);
	    embed.addField('Разработчик:', `<@${authowner}>`);
            message.channel.send(embed);
}
	
	// START MOD //
 
  if(command === "kick") {
        let err = false;
    ['KICK_MEMBERS'].forEach(function (item) {
                if (!message.member.hasPermission(item, false, true, true)) {
                    err = true;
                }
            });
    if (err) return message.channel.send('Unauthorised access');
        let member = message.mentions.members.first();
        if(!member)
          return message.reply("Fail: user not mentioned");
        if(!member.kickable) 
          return message.reply("Fail: unauthorised access for bot");
        let reason = args.slice(1).join(' ');
        if(!reason)
          return message.reply("Fail: reason is not provided");
        await member.kick(reason)
          .catch(error => message.channel.send('Unauthorised access'));
        message.channel.send(`${member.user.tag} was successfully **kicked** for: ` + '`' + reason + '`');
    }

    if(command === "ban") {
        let err = false;
    ['BAN_MEMBERS'].forEach(function (item) {
                if (!message.member.hasPermission(item, false, true, true)) {
                    err = true;
                }
            });
    if (err) return message.channel.send('Unauthorised access');
         
        let member = message.mentions.members.first();
        if(!member)
          return message.reply("Fail: user not mentioned");
        if(!member.bannable) 
          return message.reply("Fail: unauthorised access for bot");
     
        let reason = args.slice(1).join(' ');
        if(!reason)
          return message.reply("Fail: reason is not provided");
         
        await member.ban(reason)
          .catch(error => message.channel.send('Unauthorised access'));
        message.channel.send(`${member.user.tag} was successfully **banned** for: ` + '`' + reason + '`');
    }
	
// STOP MOD //
	
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
		message.author.send('Команды:\n```fix\ng!uptime - показывает статистику бота\ng!moderator - призывает Алекса Линкса (на самом деле - нет, это просто команды модератора)\ng!about - информация о создателе бота\ng!online - узнать кол-во игроков на сервере\ng!avatar [@mention] - аватарка пользователя (сделал просто так, а почему бы и нет?)\n```');
		message.reply(`проверьте свои личные сообщения`);
	}
	if(command === "about") {
	        const embed = new Discord.RichEmbed()
                .setTitle(`Обо мне:`)
                .setFooter("GRIEFMC")
                .setDescription('Данного бота сделал [SPONSOR] DipperProdYT (<@' + authowner + '>)\nБот не подтвержён сервером GRIEFMC, это чисто разработка игрока.\n\nДобавить его к себе - [тык, ;3](http://griefmcbot.thedipper.cf)');
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
