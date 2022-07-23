const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Loads songs from YouTube")
        .addSubcommand((subcommand) =>
            subcommand.setName("Song")
            .setDescription("Loads a single song from url")
            .addStringOption((option) => option.setName("url").setDescription("The song's URL").setRequired(true))
        )
        // subcmd that loads whole playlisit,
        .addSubcommand((subcommand) =>
        subcommand
            .setName("playlist")
            .setDescription("Loads a playlist of songs from a URL ")
            .addStringOption((option) => option.setName("url").setDescription("The playlist's url").setRequired(true)))

}