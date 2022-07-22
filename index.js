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

// create a slash commands loader array that selects files that end with .js

let commands = []

const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))
// loop through files in slash directory
//and pull content out of the file into slashcmd
for (const file of slashFiles) {
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    // when slash cmd loaded push data
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}

// use rest API if slash cmd is true
if (LOAD_SLASH) {
    const rest = new REST({ version: "9" }).setToken(TOKEN)
    console.log("Deploying slash commands")
    // generate URL that inserts client ID and guild ID
    // deploy this commands in the command array to the API that contains client and guild ID
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {body: commands })
    .then(() => {
        console.log("Successfully loaded")
        process.exit(0)
    })
    // if there is an error return error and stop executing code block entirely
    .catch((err) => {
        if(err){
            console.log(err)
            process.exit(1)
        }
    })
}

// handle when slash commands are NOT executed
else {
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}`)
    })
    client.on("interactionCreate", (interaction) => {
        async function handleCommand () {
            // ignore anything that is not a slash cmd
            if (!interaction.isCommand()) return
            
            // otherwise execute slash cmd from discord slash cmd collection by name of interaction
            const slashcmd = client.slashcommands.get(interaction.commandName)
            
            // for when slash cmd does not exist
            if (!slashcmd) interaction.reply("Not a valid slash command!")

            // otherwise increase bot thinking time for slash command execution
            // discord bot wait time is 3 seconds before inability to respond due to cmd failure
            await interaction.deferReply()
            await slashcmd.run({ client, interaction })
        }
        handleCommand()
    })
    client.login(TOKEN)
}