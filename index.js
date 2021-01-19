const { token, prefix } = require("./config.json");
const Discord = require("discord.js");
const client = new Discord.Client();
var mjAPI = require("mathjax-node-svg2png");
mjAPI.config({
  MathJax: {},
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  mjAPI.start();
});

client.on("message", (msg) => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  try {
    const formula = msg.content.slice(prefix.length).trim();

    if (!formula) throw ["Error: No arguments provided"];

    mjAPI.typeset(
      {
        math: formula,
        format: "TeX",
        png: true,
        scale: 2,
        timeout: 60 * 1000,
      },
      function (data) {
        if (!data.errors) {
          let pngData = data.png.split(",")[1];
          var pngBuffer = Buffer.from(pngData, "base64");
          const attachment = new Discord.MessageAttachment(
            pngBuffer,
            "math-equation.png"
          );
          msg.channel
            .send(`Here's your thingy, ${msg.author}`, attachment)
            .then(() => console.log("ok!"));
        } else {
          throw data.errors;
        }
      }
    );
  } catch (err) {
    console.log(err);

    let response = "something's gone wrong!\n\n";

    if (!err.length) {
      response += err;
    } else {
      err.forEach((errMsg) => {
        response += errMsg + "\n";
      });
    }

    msg.reply(response);
  }
});

client.login(token);
