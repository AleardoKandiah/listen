const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("displays info about the currently playing song"),

    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)
        
        if (!queue) return await interaction.editReply("There are no songs in the queue")
 
        // create a progress bar
        await interaction.editReply(`The queue of ${queue.tracks.length} songs have been shuffled!`)
    }
}