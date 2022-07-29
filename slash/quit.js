const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quit")
        .setDescription("stops the bot and clears the queue"),

    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)
    }
}