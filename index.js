const Discord = require("discord.js")
const dotenv = require("dotenv")
const { REST } = require("discordjs/rest")
const { Routes } = require("discord-api-tyoes/v9") //REST and routes for slash commands
const fs = require("fs") //file integration 
const { Player } = require("discord-player") //help manage quering in songs


dotenv.config
const TOKEN = process.env.TOKEN

// load command allow script initialization with boolean intrepretation 
const LOAD_SLASH = process.argv[2] == "load"

const CLIENT_ID = "999620563930722314"
const GUILD_ID = "918637381341548554"

// initialise discord client
const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_VOICE_STATES"
    ]
})

client.slashcommands = new Discord.Collection()
// YouTube downloader to handle music streaming
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

// create a slash commands loader

let commands = []

const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))