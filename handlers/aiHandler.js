const { GoogleGenerativeAI } = require("@google/generative-ai");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const { sendLog } = require("./logHandler");

let aiStatus = true; // Status fitur AI, default aktif
const allowedChannels = process.env.ALLOWED_AI_CHANNELS.split(",");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Simpan konteks percakapan berdasarkan user ID
const conversationContext = new Map();

// Simpan waktu cooldown untuk setiap pengguna
const cooldowns = new Map();
const COOLDOWN_TIME = 10000; // 10 detik cooldown

module.exports = {
    handleAiChat: async (message) => {
        const prefix = "ai.chat";
        if (!message.content.startsWith(prefix)) return;

        // Cek apakah pesan berada di dalam thread atau di channel yang diperbolehkan
        const isInAllowedChannel = allowedChannels.includes(message.channel.id);
        const isInThread = message.channel.isThread(); // Mengecek apakah pesan berada di dalam thread
        const threadParentId = isInThread ? message.channel.parentId : null; // Mengambil parent ID jika berada di thread
        const isInAllowedThread = isInAllowedChannel || 
            (isInThread && allowedChannels.includes(threadParentId)); // Memastikan thread berada di channel yang diizinkan

        // Hapus prefix untuk mendapatkan pertanyaan pengguna
        const userQuestion = message.content.slice(prefix.length).trim();

        // Jika pengguna hanya menulis "ai.chat" tanpa pertanyaan
        if (!userQuestion) {
            // Jika pengguna berada di channel yang tidak diizinkan
            if (!isInAllowedChannel && !isInAllowedThread) {
                const allowedChannelTags = allowedChannels
                    .map((channelId) => `<#${channelId}>`)
                    .join(", ");

                const replyMessage = await message.reply({
                    content: `Fitur ini hanya dapat digunakan di channel atau thread ${allowedChannelTags}`,
                });

                // Hapus pesan balasan bot dan command pengguna setelah 5 detik
                setTimeout(async () => {
                    try {
                        await message.delete();
                        await replyMessage.delete();
                    } catch (error) {
                        const logFields = [
                            { name: "Error Message", value: error.message || "Tidak ada pesan error", inline: false },
                        ];

                        if (isInThread) {
                            logFields.push(
                                { name: "Channel", value: `#${message.channel.parent.name}`, inline: true },
                                { name: "Thread", value: `#${message.channel.name}`, inline: true }
                            );
                        } else {
                            logFields.push(
                                { name: "Channel", value: `#${message.channel.name}`, inline: true }
                            );
                        }

                        await sendLog(message.client, process.env.LOG_CHANNEL_ID, {
                            author: {
                                name: message.client.user.tag,
                                icon_url: message.client.user.displayAvatarURL(),
                            },
                            title: "Error saat menghapus pesan",
                            description: "Terjadi kesalahan saat mencoba menghapus pesan bot atau command pengguna.",
                            fields: logFields,
                            timestamp: Date.now(),
                        });
                    }
                }, 5000);

                return;
            } else {
                // Jika pengguna berada di channel yang diizinkan, tapi tidak menulis pertanyaan
                return message.reply("Silakan tuliskan masalah yang ingin Anda tanyakan setelah `ai.chat`.");
            }
        }

        // Jika pengguna menulis "ai.reset"
        if (userQuestion.toLowerCase() === ".reset") {
            conversationContext.delete(message.author.id);

            const replyMessage = await message.reply({
                content: `Konteks percakapan telah direset.`,
            });
            
            setTimeout(async () => {
                try {
                    await message.delete();
                    await replyMessage.delete();
                } catch (error) {
                    const logFields = [
                        { name: "Error Message", value: error.message || "Tidak ada pesan error", inline: false },
                    ];

                    if (isInThread) {
                        logFields.push(
                            { name: "Channel", value: `#${message.channel.parent.name}`, inline: true },
                            { name: "Thread", value: `#${message.channel.name}`, inline: true }
                        );
                    } else {
                        logFields.push(
                            { name: "Channel", value: `#${message.channel.name}`, inline: true }
                        );
                    }

                    await sendLog(message.client, process.env.LOG_CHANNEL_ID, {
                        author: {
                            name: message.client.user.tag,
                            icon_url: message.client.user.displayAvatarURL(),
                        },
                        title: "Error saat menghapus pesan",
                        description: "Terjadi kesalahan saat mencoba menghapus pesan bot atau command pengguna.",
                        fields: logFields,
                        timestamp: Date.now(),
                    });
                }
            }, 5000);

            return;
        }

        // Jika fitur AI nonaktif
        if (!aiStatus) {
            // Jika pengguna berada di channel yang tidak diizinkan
            if (!isInAllowedChannel && !isInAllowedThread) {
                const allowedChannelTags = allowedChannels
                    .map((channelId) => `<#${channelId}>`)
                    .join(", ");

                const replyMessage = await message.reply({
                    content: `Fitur ini hanya dapat digunakan di channel atau thread ${allowedChannelTags}`,
                });

                // Hapus pesan balasan bot dan command pengguna setelah 5 detik
                setTimeout(async () => {
                    try {
                        await message.delete();
                        await replyMessage.delete();
                    } catch (error) {
                        const logFields = [
                            { name: "Error Message", value: error.message || "Tidak ada pesan error", inline: false },
                        ];

                        if (isInThread) {
                            logFields.push(
                                { name: "Channel", value: `#${message.channel.parent.name}`, inline: true },
                                { name: "Thread", value: `#${message.channel.name}`, inline: true }
                            );
                        } else {
                            logFields.push(
                                { name: "Channel", value: `#${message.channel.name}`, inline: true }
                            );
                        }

                        await sendLog(message.client, process.env.LOG_CHANNEL_ID, {
                            author: {
                                name: message.client.user.tag,
                                icon_url: message.client.user.displayAvatarURL(),
                            },
                            title: "Error saat menghapus pesan",
                            description: "Terjadi kesalahan saat mencoba menghapus pesan bot atau command pengguna.",
                            fields: logFields,
                            timestamp: Date.now(),
                        });
                    }
                }, 5000);

                return;
            } else {
                // Jika pengguna berada di channel yang diizinkan, tapi fitur AI nonaktif
                return message.reply("Fitur AI sedang nonaktif. Hubungi admin untuk mengaktifkan fitur ini.");
            }
        }

        // Jika pengguna berada di channel yang tidak diizinkan dan fitur AI aktif
        if (!isInAllowedChannel && !isInAllowedThread && !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const allowedChannelTags = allowedChannels
                .map((channelId) => `<#${channelId}>`)
                .join(", ");

            const replyMessage = await message.reply({
                content: `Fitur ini hanya dapat digunakan di channel atau thread ${allowedChannelTags}`,
            });

            // Hapus pesan balasan bot dan command pengguna setelah 5 detik
            setTimeout(async () => {
                try {
                    await message.delete();
                    await replyMessage.delete();
                } catch (error) {
                    const logFields = [
                        { name: "Error Message", value: error.message || "Tidak ada pesan error", inline: false },
                    ];

                    if (isInThread) {
                        logFields.push(
                            { name: "Channel", value: `#${message.channel.parent.name}`, inline: true },
                            { name: "Thread", value: `#${message.channel.name}`, inline: true }
                        );
                    } else {
                        logFields.push(
                            { name: "Channel", value: `#${message.channel.name}`, inline: true }
                        );
                    }

                    await sendLog(message.client, process.env.LOG_CHANNEL_ID, {
                        author: {
                            name: message.client.user.tag,
                            icon_url: message.client.user.displayAvatarURL(),
                        },
                        title: "Error saat menghapus pesan",
                        description: "Terjadi kesalahan saat mencoba menghapus pesan bot atau command pengguna.",
                        fields: logFields,
                        timestamp: Date.now(),
                    });
                }
            }, 5000);

            return;
        }

        // Cek cooldown
        const now = Date.now();
        const cooldownEnd = cooldowns.get(message.author.id) || 0;

        if (now < cooldownEnd) {
            const remainingTime = Math.ceil((cooldownEnd - now) / 1000); // Sisa waktu cooldown dalam detik
            const replyMessage = await message.reply({
                content: `Tunggu ${remainingTime} detik sebelum mengirim pertanyaan lagi.`,
            });

            // Hapus pesan balasan bot setelah cooldown selesai
            setTimeout(async () => {
                try {
                    await message.delete();
                    await replyMessage.delete();
                } catch (error) {
                    console.error("Gagal menghapus pesan cooldown:", error);
                }
            }, remainingTime * 1000);

            return;
        }

        try {
            // Ambil konteks percakapan sebelumnya
            const userId = message.author.id;
            const context = conversationContext.get(userId) || [];

            // Tambahkan pertanyaan baru ke konteks
            context.push({ role: "user", parts: [{ text: userQuestion }] });

            // Kirim konteks percakapan ke model AI
            const response = await model.generateContent({
                contents: context,
            });

            let answer = response.response.text();

            // Tambahkan jawaban AI ke konteks
            context.push({ role: "model", parts: [{ text: answer }] });

            // Simpan konteks percakapan untuk pengguna
            conversationContext.set(userId, context);

            // Set cooldown
            cooldowns.set(userId, now + COOLDOWN_TIME);

            // Pisahkan jawaban menjadi beberapa bagian jika lebih dari 4096 karakter
            const answerParts = [];
            while (answer.length > 4096) {
                answerParts.push(answer.slice(0, 4096));
                answer = answer.slice(4096);
            }
            answerParts.push(answer);

            // Kirim embed pertama dengan membalas pesan pengguna
            const firstEmbed = new EmbedBuilder()
                .setAuthor({
                    name: `Powered by Gemini AI`,
                    iconURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThr7qrIazsvZwJuw-uZCtLzIjaAyVW_ZrlEQ&s",
                })
                .setTitle(`Jawaban dari pertanyaan ${message.author.username}`)
                .setDescription(answerParts[0])
                .setFooter({
                    text: `Jawaban ini dihasilkan oleh AI dan mungkin tidak sepenuhnya akurat.`,
                })
                .setTimestamp();

            // Tombol untuk embed
            const buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Donasi")
                    .setURL("https://saweria.co/donate/kudettech5")
                    .setStyle(ButtonStyle.Link)
                    .setEmoji({ id: "1321794204224978954" }), // Logo Saweria
                new ButtonBuilder()
                    .setLabel("YouTube")
                    .setURL("https://www.youtube.com/@KudetTech")
                    .setStyle(ButtonStyle.Link)
                    .setEmoji({ id: "1322153506034942064" }) // Ganti dengan ID emoji custom
            );

            let replyMessage;
            if (isInThread) {
                replyMessage = await message.channel.send({ embeds: [firstEmbed], components: answerParts.length === 1 ? [buttons] : [] });
            } else {
                replyMessage = await message.reply({ embeds: [firstEmbed], components: answerParts.length === 1 ? [buttons] : [] });
            }

            // Kirim embed lanjutan (jika ada)
            for (let i = 1; i < answerParts.length; i++) {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `Powered by Gemini AI`,
                        iconURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThr7qrIazsvZwJuw-uZCtLzIjaAyVW_ZrlEQ&s",
                    })
                    .setTitle(`Lanjutan jawaban dari pertanyaan ${message.author.username}`)
                    .setDescription(answerParts[i])
                    .setFooter({
                        text: `Jawaban ini dihasilkan oleh AI dan mungkin tidak sepenuhnya akurat.`,
                    })
                    .setTimestamp();

                // Tambahkan tombol hanya pada embed terakhir
                if (i === answerParts.length - 1) {
                    // Kirim embed dengan tombol
                    if (isInThread) {
                        await replyMessage.reply({ embeds: [embed], components: [buttons] });
                    } else {
                        await replyMessage.reply({ embeds: [embed], components: [buttons] });
                    }
                } else {
                    // Kirim embed tanpa tombol
                    if (isInThread) {
                        await replyMessage.reply({ embeds: [embed] });
                    } else {
                        await replyMessage.reply({ embeds: [embed] });
                    }
                }
            }

            // Log penggunaan AI
            const logFields = [
                { name: "User", value: `<@${message.author.id}>`, inline: true },
            ];

            // Menambahkan informasi thread jika pesan berada di dalam thread
            if (isInThread) {
                logFields.push(
                    { name: "Channel", value: `#${message.channel.parent.name}`, inline: true },
                    { name: "Thread", value: `#${message.channel.name}`, inline: true }
                );
            } else {
                logFields.push(
                    { name: "Channel", value: `#${message.channel.name}`, inline: true }
                );
            }

            await sendLog(message.client, process.env.LOG_CHANNEL_ID, {
                author: {
                    name: message.author.tag,
                    icon_url: message.author.displayAvatarURL(),
                },
                title: "Penggunaan Fitur AI",
                description: `**Pertanyaan:** ${userQuestion}`,
                fields: logFields,
                userId: message.author.id,
            });
        } catch (error) {
            console.error("Error saat memproses permintaan AI:", error);

            // Log error dengan Channel atau Thread yang relevan
            const errorLogFields = [
                { name: "Error Message", value: error.message || "Tidak ada pesan error", inline: false },
                { name: "User", value: `<@${message.author.id}>`, inline: true },
            ];

            // Menambahkan informasi thread jika pesan berada di dalam thread
            if (isInThread) {
                errorLogFields.push(
                    { name: "Channel", value: `#${message.channel.parent.name}`, inline: true },
                    { name: "Thread", value: `#${message.channel.name}`, inline: true }
                );
            } else {
                errorLogFields.push(
                    { name: "Channel", value: `#${message.channel.name}`, inline: true }
                );
            }

            // Kirimkan log error ke log channel
            await sendLog(message.client, process.env.LOG_CHANNEL_ID, {
                author: {
                    name: message.client.user.tag,
                    icon_url: message.client.user.displayAvatarURL(),
                },
                title: "Error saat memproses AI",
                description: `Terjadi kesalahan saat memproses pertanyaan: ${userQuestion}`,
                fields: errorLogFields,
                userId: message.author.id,
                timestamp: Date.now(),
            });

            // Beri tahu pengguna tentang kesalahan
            await message.reply("Terjadi kesalahan saat memproses permintaan Anda. Silahkan hubungi Admin.");
        }
    },

    toggleAiStatus: (status) => {
        aiStatus = status;
    },

    getAiStatus: () => aiStatus,
};