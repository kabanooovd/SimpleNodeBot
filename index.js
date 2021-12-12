const TelegramApi = require("node-telegram-bot-api")
const {gameOptions, gameRemoteOptions} = require("./options.js")

const token = "5042865653:AAFEt_L3NTArc9Yec71DCxw7qp1SfGyQc5I";

const bot = new TelegramApi(token, {polling: true})

const chats = {}

// const gameOptions = {
//     reply_markup: JSON.stringify({
//         inline_keyboard: [
//             [{text: "1", callback_data: "1"}, {text: "2", callback_data: "2"}, {text: "3", callback_data: "3"}],
//             [{text: "4", callback_data: "4"}, {text: "5", callback_data: "5"}, {text: "6", callback_data: "6"}],
//             [{text: "7", callback_data: "7"}, {text: "8", callback_data: "8"}, {text: "9", callback_data: "9"}],
//             [{text: "0", callback_data: "0"}],
//         ]
//     })
// };
//
// const gameRemoteOptions = {
//     reply_markup: JSON.stringify({
//         inline_keyboard: [
//             [{text: "Plat again", callback_data: "/again"}],
//         ]
//     })
// };

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, "Give ne 0 - 9 number... ")
    const randomNumber = Math.floor(Math.random() * 10).toString()
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "Try to guess... ", gameOptions)
}

const startApp = () => {
    bot.setMyCommands([
        {command: "/start", description: "Initial Hi... "},
        {command: "/info", description: "Get user Info... "},
        {command: "/game", description: "Start play a game... "},
    ])

    bot.on("message", async msg => {
        const text = msg.text;
        const chatId = msg.chat.id

        if (text === "/start") {
            await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/d06/e20/d06e2057-5c13-324d-b94f-9b5a0e64f2da/4.webp")
            return bot.sendMessage(chatId, `Welcome, I'm bot... `)
        }

        if (text === "/info") {
            return bot.sendMessage(chatId, "Your name is " + msg.from.first_name)
        }

        if (text === "/game") {
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, "I cant understand you, use correct command please... ")

    })

    bot.on("callback_query", async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id
        if (data === "/again") {
            return startGame(chatId)
        }
        if (data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Congrats, the ${chats[chatId]} is correct... `, gameRemoteOptions)
        } else {
            return await bot.sendMessage(chatId, `Unfortunatly ${chats[chatId]} is the correct answer... `, gameRemoteOptions)
        }
    })

}

startApp();