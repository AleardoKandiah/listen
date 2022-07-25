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
            .addStringOption((option) => option.setName("url").setDescription("The song's url").setRequired(true)
            )
        )
        // subcmd that loads whole playlist,
        .addSubcommand((subcommand) =>
        subcommand
            .setName("playlist")
            .setDescription("Loads a playlist of songs from a URL ")
            .addStringOption((option) => option.setName("url").setDescription("The playlist's url").setRequired(true)
            )
        )
        //search search cmd via keywords
        .addSubcommand((subcommand)=>
            subcommand.setName("search").setDescription("Searches of song based on provided keyword(s)")
            .addStringOption((option) => option.setName("search terms").setDescription("the search keyword").setRequired(true)
            )
        ),
        run: async ({ client, interaction }) => {
            // check if user is in a VC
            if (!interaction.member.voice.channel)
            return interaction.editReply("You need to be in a voice channel to use this command")
            // else create a queue
            const queue = await client.player.createQueue(interaction.guild)
            // when there is no queue add bot to VC 
            if (!queue.connection) await queue.connection(interaction.member.voice.channel)

            let embed = new MessageEmbed()

            // handle singular SpeechRecognitionAlternative, playlist and search
            
            if (interaction.options.getSubcommand() == "song"){
                let url = interaction.options.getString("url")
                const result = await client.player.search(url, {
                    requestBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_VIDEO
                })
                if (result.tracks.length === 0)
                    return interaction.editReply("No results")
                const song = result.tracks[0]
                await queue.addTrack(song)
                embed
                    .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Duration: ${song.duration}`})

            } else if (interaction.options.getSubcommand() == "playlist"){
                let url = interaction.options.getString("url")
                const result = await client.player.search(url, {
                    requestBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_PLAYLIST
                })
                if (result.tracks.length === 0)
                    return interaction.editReply("No results")
                const playlist = result.playlist
                await queue.addTracks(result.tracks)
                embed
                    .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`)
                    .setThumbnail(playlist.thumbnail)
            
                } else if (interaction.options.getSubcommand() == "search") {
                    let url = interaction.options.getString("search terms")
                const result = await client.player.search(url, {
                    requestBy: interaction.user,
                    searchEngine: QueryType.AUTO
                })
                if (result.tracks.length === 0)
                    return interaction.editReply("No results")
                const song = result.tracks[0]
                await queue.addTrack(song)
                embed
                    .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Duration: ${song.duration}`})
            }
            // if queue is not currently playing, initiate playing
            if (!queue.playing) await queue.play()
            await interaction.editReply({
                embeds: [embed] 
            })
        }
}