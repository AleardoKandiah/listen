const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

// add pagination system to handle dozens of songs
module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("displays the current song queue")
    .addNumberOption((option) => option.setName("page").setDescription("Page nunber of queue").setMinValue(1)),

    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)
        if (!queue || !queue.playing){
            return await interaction.editReply("There are no songs in the queue")
        }

        // otherwise check number of pages to see if options are valid or not
        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (interaction.option.getNumber("page") || 1) -1
        
        if (page > totalPages)
        return await interaction.editReply(`Invalid page. There are a total of ${totalPages} pages of songs`)
    

        // Handle display
        const queueString = queue.slice(page * 10, + 10).map((song, i) => {
            return `**${page * 10 + i + 1}.**\`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`
        }).join("\n")

        const currentSong = queue.current

        await interaction.editReply({
            embed: [
                new MessageEmbed()
                    .setDescription(`**Currently Playing**\n` +
                    (currentSong ? `\`[${currentSong.duration}]\`${currentSong.title} --<@${currentSong.requestedBy.id}>` : "None") *
                    `\n\n**Queue**\n${queueString}`
                    )

                    .setFooter({
                        text: `Page ${page + 1}`
                    })
            ]
        })
        
    }
}