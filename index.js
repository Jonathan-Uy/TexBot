const { token, prefix } = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
var svg2img = require('svg2img');
const { convert } = require('convert-svg-to-png');
var mjAPI = require("mathjax-node-svg2png");
mjAPI.config({
  MathJax: {
    // traditional MathJax configuration
  }
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  mjAPI.start();
});

client.on('message', msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return

  const formula = msg.content.slice(prefix.length).trim()

  try {
    mjAPI.typeset({
      math: formula,
      format: "TeX",
      png:true,
      scale: 2
    }, function (data) {
      if (!data.errors) {
        console.log(data.png)
        const embedResponse = new Discord.MessageEmbed()
          .setColor('#C0C0C0')
          .setTitle('Your thingy')
          .setImage(url(data.png))
        msg.channel.send(embedResponse)
        // const attachment = new Discord.MessageAttachment(Buffer.from("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", "base64"), "math-equation.png")
        // msg.channel.send(`Here's your thingy, ${msg.author}`, attachment)
        // console.log(data.svg)
        // convert(data.svg).then(buffer => {
        //   const attachment = new Discord.MessageAttachment(buffer, "math-equation.png")
        //   msg.channel.send(`Here's your thingy, ${msg.author}`, attachment)
        // })
        // svg2img(data.svg, (error, buffer) => {
        //   const attachment = new Discord.MessageAttachment(buffer, "math-equation.png")
        //   msg.channel.send(`Here's your thingy, ${msg.author}`, attachment)
        // })
      }
    });
  } catch (err) {
    msg.reply('You stupid bitch this is what went wrong: ', err);
  }
});

client.login(token);