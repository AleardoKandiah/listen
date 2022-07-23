const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Loads songs from YouTube")
        .addSubcommand((subcommand) =>
            subcommand.setName("Song")
            .setDescription("Loads a single song from URL")
            .addStringOption((option) => option.setName("URL").setDescription("The song's URL").setRequired(true)))
}