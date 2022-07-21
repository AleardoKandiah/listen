const Discord = require("discord.js")
const dotenv = require("dotenv")
const { REST } = require("discordjs/rest")
const { Routes } = require("discord-api-tyoes/v9") //REST and routes for slash commands
const fs = require("fs") //file integration 
const { Player } = require("discord-player") //help manage quering in song


dotenv.config
const TOKEN = process.env.TOKEN