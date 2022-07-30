const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("displays info about the currently playing song"),

    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)
        
        if (!queue) return await interaction.editReply("There are no songs in the queue")
 
        // create a progress bar
        let bar = queue.createProgressBar({
            queue: false,
            length: 19
        })
        await interaction.editReply({
            embeds: [e]
        })
    }
}