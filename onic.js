global.__base = __dirname + '/';
require('./src/options/settings')
const {
    default: WADefault,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    makeInMemoryStore,
    jidDecode,
    proto,
    makeCacheableSignalKeyStore,
    PHONENUMBER_MCC
} = require("@adiwajshing/baileys")
const NodeCache = require("node-cache")
const readline = require("readline")
const pino = require('pino')
const chalk = require('chalk')
const figlet = require('figlet')
const pairingCode = true
const useMobile = false
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
const {
    Boom
} = require('@hapi/boom')
const fs = require('fs')
const axios = require('axios')
const FileType = require('file-type')
const fetch = require('node-fetch')
const PhoneNumber = require('awesome-phonenumber')
const path = require('path')


const {
    smsg,
    getBuffer,
    fetchJson,
    TelegraPh,
    delay
} = require('./lib/simple')
const {
    checkCommitUpdate,
    setVersiCommited,
    client
} = require('./lib/dbmongosle')

const {
    toAudio,
    toPTT,
    toVideo
} = require('./lib/converter')
const {
    imageToWebp,
    videoToWebp,
    writeExifImg,
    writeExifVid,
    writeExif
} = require('./lib/exif')

const store = makeInMemoryStore({
    logger: pino().child({
        level: 'silent',
        stream: 'store'
    })
})


let ttlerr = 0
let isduakali = 0


console.log(chalk.hex('#FF9F84').bold('SiTotes Bot Wait Running...'))

async function Botstarted() {
    const {
        state,
        saveCreds
    } = await useMultiFileAuthState(`./${sessionName}`)
    const {
        version,
        isLatest
    } = await fetchLatestBaileysVersion();
    const msgRetryCounterCache = new NodeCache()
    const onic = WADefault({
        version,
        logger: pino({
            level: "fatal"
        }).child({
            level: "fatal"
        }),
        printQRInTerminal: !pairingCode,
        mobile: useMobile,
        browser: ['Si-Totes (2019)', '', ''],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({
                level: "fatal"
            }).child({
                level: "fatal"
            })),
        },
        generateHighQualityLinkPreview: true, // make high preview link
        getMessage: async (key) => {
            let jid = jidNormalizedUser(key.remoteJid)
            let msg = await store.loadMessage(jid, key.id)

            return msg?.message || ""
        },
        msgRetryCounterCache, // Resolve waiting messages
        defaultQueryTimeoutMs: undefined,

    })
    
    if (isduakali < 1) {
        console.log(chalk.hex('#9AFF78').bold(figlet.textSync('SI-TOTES', {
            font: 'Standard',
            horizontalLayout: 'default',
            vertivalLayout: 'default',
            whitespaceBreak: false
        })))

        console.log(chalk.hex('#FFDF66')(`\nModules: WhiskeySockets/Baileys +\n\nBOT INFO:→ +\n←======================→ +\nBot By: m.saiful.anam.r +\nBot Name: SiTotes Bot +\n\nDibuat: 3,mei,2019 +\nUp: Kamis, 25, Mei +\n\n\nMenunggu terhubung ke WhatsApp...\n`))
        isduakali++
    } else {
        console.log(chalk.hex('#FF9F84').bold('SiTotes Bot Menghubungkan ulang...'))
    }
    
    nocache('./slebeww', module => console.log(` "${module}" Telah diupdate!`))
    nocache('./src/options/settings', module => console.log(` "${module}" Telah diupdate!`))
    require('./lib/simple')
    nocache('./lib/simple', module => console.log(` "${module}" Telah diupdate!`))

    store.bind(onic.ev)
    onic.sendPesan = async (...args) => {
        await delay(5)
        await onic.sendMessage(...args)
    }

    onic.ev.on('messages.upsert', async chatUpdate => {
        try {
            mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return
            if (!onic.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
            if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
            m = smsg(onic, mek, store)
            require("./slebeww")(onic, m, chatUpdate, mek, store)
        } catch (err) {
            console.log(err)
        }
    })
    if (pairingCode && !onic.authState.creds.registered) {
        if (useMobile) throw new Error('Cannot use pairing code with mobile api')

        let phoneNumber
        if (!!pairingNumber) {
            phoneNumber = pairingNumber.replace(/[^0-9]/g, '')

            if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
                console.log("Start with your country's WhatsApp code, Example : 62xxx")
                process.exit(0)
            }
        } else {
            phoneNumber = await question(`Please type your WhatsApp number : `)
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

            // Ask again when entering the wrong number
            if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
                console.log("Start with your country's WhatsApp code, Example : 62xxx")

                phoneNumber = await question(`Please type your WhatsApp number : `)
                phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
                rl.close()
            }
        }

        setTimeout(async () => {
            let code = await onic.requestPairingCode(phoneNumber)
            code = code?.match(/.{1,4}/g)?.join("-") || code
            console.log(`Your Pairing Code : `, code)
        }, 3000)
    }
    onic.ev.on('group-participants.update', async (anu) => {
        
    })

    // Setting
    onic.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    onic.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = onic.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = {
                id,
                name: contact.notify
            }
        }
    })

    onic.getName = (jid, withoutContact = false) => {
        id = onic.decodeJid(jid)
        withoutContact = onic.withoutContact || withoutContact
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = onic.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
                id,
                name: 'WhatsApp'
            } : id === onic.decodeJid(onic.user.id) ?
            onic.user :
            (store.contacts[id] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }

    onic.sendContact = async (jid, kon, quoted = '', opts = {}) => {
        let list = []
        for (let i of kon) {
            list.push({
                displayName: await onic.getName(i + '@s.whatsapp.net'),
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await onic.getName(i + '@s.whatsapp.net')}\nFN:${await onic.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            })
        }
        onic.sendPesan(jid, {
            contacts: {
                displayName: `${list.length} Kontak`,
                contacts: list
            },
            ...opts
        }, {
            quoted
        })
    }

    onic.public = true

    onic.serializeM = (m) => smsg(onic, m, store)

    
    onic.ev.on('connection.update', async (update) => {
        const {
            connection,
            lastDisconnect,
        } = update
        if (connection === 'close') {
            ttlerr++
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason === DisconnectReason.badSession) {
                console.log(chalk.hex('#FF6158')(`SENDER → File Sesi Buruk, Harap Hapus Sesi dan Pindai Lagi`));
                setTimeout(startonic, 10000)
            } else if (reason === DisconnectReason.connectionClosed) {
                console.log(chalk.hex('#FF6158')("SENDER → Koneksi ditutup, menghubungkan kembali...."));
                //setTimeout(startonic, 10000)
                throw new Error('Bot Crash → By sitotes anti Stuck reload')
            } else if (reason === DisconnectReason.connectionLost) {
                console.log(chalk.hex('#FF6158')("SENDER → Koneksi Hilang dari Server, menyambungkan kembali..."));
                //setTimeout(startonic, 10000)
                throw new Error('Bot Crash → By sitotes anti Stuck reload')
            } else if (reason === DisconnectReason.connectionReplaced) {
                console.log(chalk.hex('#FF6158')("SENDER → Koneksi Diganti, Sesi Baru Lain Dibuka, menghubungkan kembali..."));
                setTimeout(startonic, 10000)
            } else if (reason === DisconnectReason.loggedOut) {
                console.log(chalk.hex('#FF6158')(`SENDER → Perangkat Keluar, Harap Pindai Lagi Dan Jalankan.`));
                setTimeout(startonic, 10000)
            } else if (reason === DisconnectReason.restartRequired) {
                console.log(chalk.hex('#FF6158')("SENDER → Restart Diperlukan, Restart..."));
                setTimeout(startonic, 10000)
            } else if (reason === DisconnectReason.timedOut) {
                console.log(chalk.hex('#FF6158')("SENDER → Koneksi Habis, Menghubungkan..."));
                setTimeout(startonic, 10000)
            } else onic.end(chalk.hex('#FF6158')(`SENDER → Alasan Putus Tidak Diketahui: ${reason}|${connection}`))

            if (ttlerr > 3) {
                console.log(chalk.white.bgRed.bold('Crash by → Connection Loop'))
                throw new Error('Bot Crash → By sitotes anti loop')
            }
        }
        if (update.connection == "open" || update.receivedPendingNotifications == "true") {
            await store.chats.all()
            console.log(chalk.hex('#FFAD99').bold(`Terhubung dengan = ` + JSON.stringify(onic.user, null, 2)))

            checkCommitUpdate().then(async bcsk => {
                let vcp = bcsk.versi.split('.')
                vcp = (((vcp[2]) + (vcp[1])) + (vcp[0])).trim()
                let ccp = bcsk.commit.split('.')
                ccp = (((ccp[2]) + (ccp[1])) + (ccp[0])).trim()

                if (parseInt(ccp) > parseInt(vcp)) {
                    await onic.sendPesan('6288989781626@s.whatsapp.net', {
                        text: `Refresh Deploy SiTotes : v${bcsk.commit}Dev`
                    }).then((result) => setVersiCommited(bcsk.commit))
                }
            })

        }
    })

    onic.ev.on('creds.update', saveCreds)

    onic.sendText = (jid, text, quoted = '', options) => onic.sendPesan(jid, {
        text: text,
        ...options
    }, {
        quoted,
        ...options
    })

    onic.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }

        return buffer
    }

    onic.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {

        let quoted = message.msg ? message.msg : message

        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        let type = await FileType.fromBuffer(buffer)
        trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        // save to file
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }
    onic.sendTextWithMentions = async (jid, text, quoted, options = {}) => onic.sendPesan(jid, {
        text: text,
        mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
        ...options
    }, {
        quoted
    })
    onic.getFile = async (PATH, returnAsFilename) => {
        let res, filename
        const data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
        const type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }
        if (data && returnAsFilename && !filename)(filename = path.join(__dirname, './image/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
        return {
            res,
            filename,
            ...type,
            data,
            deleteFile() {
                return filename && fs.promises.unlink(filename)
            }
        }
    }
    
    onic.sendReaction = async (jid, key, text) => {
        return await onic.sendPesan(jid, {
            react: {
                text: text,
                key: key
            }
        })
    }
    
    onic.sendPoll = async(jid, name = '', values = [], selectableCount = 1, options = {}) => {
        return await onic.sendPesan(jid, {
            poll: {
                name,
                values,
                selectableCount
            },
            ...options
        })
    }

    onic.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
        let type = await onic.getFile(path, true)
        let {
            res,
            data: file,
            filename: pathFile
        } = type
        if (res && res.status !== 200 || file.length <= 65536) {
            try {
                throw {
                    json: JSON.parse(file.toString())
                }
            } catch (e) {
                if (e.json) throw e.json
            }
        }
        let opt = {
            filename
        }
        if (quoted) opt.quoted = quoted
        if (!type) options.asDocument = true
        let mtype = '',
            mimetype = type.mime,
            convert
        if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
        else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
        else if (/video/.test(type.mime)) mtype = 'video'
        else if (/audio/.test(type.mime))(
            convert = await (ptt ? toPTT : toAudio)(file, type.ext),
            file = convert.data,
            pathFile = convert.filename,
            mtype = 'audio',
            mimetype = 'audio/ogg; codecs=opus'
        )
        else mtype = 'document'
        if (options.asDocument) mtype = 'document'

        delete options.asSticker
        delete options.asLocation
        delete options.asVideo
        delete options.asDocument
        delete options.asImage

        let message = {
            ...options,
            caption,
            ptt,
            [mtype]: {
                url: pathFile
            },
            mimetype
        }
        let m
        try {
            m = await onic.sendPesan(jid, message, {
                ...opt,
                ...options
            })
        } catch (e) {
            //console.error(e)
            m = null
        } finally {
            if (!m) m = await onic.sendPesan(jid, {
                ...message,
                [mtype]: file
            }, {
                ...opt,
                ...options
            })
            file = null
            return m
        }
    }
    onic.sendMedia = async (jid, path, filename, quoted = '', options = {}) => {
        let {
            ext,
            mime,
            data
        } = await onic.getFile(path)
        messageType = mime.split("/")[0]
        pase = messageType.replace('application', 'document') || messageType
        return await onic.sendPesan(jid, {
            [`${pase}`]: data,
            mimetype: mime,
            fileName: filename + ext ? filename + ext : getRandom(ext),
            ...options
        }, {
            quoted
        })
    }
    onic.sendMediaAsSticker = async (jid, path, quoted, options = {}) => {
        let {
            ext,
            mime,
            data
        } = await onic.getFile(path)
        let media = {}
        let buffer
        media.data = data
        media.mimetype = mime
        if (options && (options.packname || options.author)) {
            buffer = await writeExif(media, options)
        } else {
            buffer = /image/.test(mime) ? await imageToWebp(data) : /video/.test(mime) ? await videoToWebp(data) : ""
        }
        await onic.sendPesan(jid, {
            sticker: {
                url: buffer
            },
            ...options
        }, {
            quoted
        })
        return buffer
    }
    onic.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }

        await onic.sendPesan(jid, {
            sticker: {
                url: buffer
            },
            ...options
        }, {
            quoted
        })
        return buffer
    }

    onic.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options)
        } else {
            buffer = await videoToWebp(buff)
        }

        await onic.sendPesan(jid, {
            sticker: {
                url: buffer
            },
            ...options
        }, {
            quoted
        })
        return buffer
    }
    onic.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
        let buttonMessage = {
            text,
            footer,
            buttons,
            headerType: 2,
            ...options
        }
        onic.sendPesan(jid, buttonMessage, {
            quoted,
            ...options
        })
    }
    onic.send1ButMes = (jid, text = '', footer = '', butId = '', dispText = '', quoted, ments) => {
        let but = [{
            buttonId: butId,
            buttonText: {
                displayText: dispText
            },
            type: 1
        }]
        let butMes = {
            text: text,
            buttons: but,
            footer: footer,
            mentions: ments ? ments : []
        }
        onic.sendPesan(jid, butMes, {
            quoted: quoted
        })
    }

    onic.sendButImage = async (jid, link, but = [], text = '', footer = '', ments = [], quoted) => {
        let dlimage;
        try {
            dlimage = await getBuffer(link)
        } catch {
            dlimage = await getBuffer('https://telegra.ph/file/ca0234ea67c9a8b8af9a1.jpg')
        }
        const buttonMessage = {
            image: dlimage,
            caption: text,
            footer: footer,
            buttons: but,
            headerType: 'IMAGE',
            mentions: ments
        }

        onic.sendPesan(jid, buttonMessage, quoted)
    }
    onic.sendFakeLink = (jid, text, salam, footer_text, pp_bot, myweb, pushname, quoted) => onic.sendPesan(jid, {
        text: text,
        contextInfo: {
            "externalAdReply": {
                "title": `Selamat ${salam} ${pushname}`,
                "body": footer_text,
                "previewType": "PHOTO",
                "thumbnailUrl": ``,
                "thumbnail": pp_bot,
                "sourceUrl": myweb
            }
        }
    }, {
        quoted
    })

    return onic
}

Botstarted()





function nocache(module, cb = () => {}) {
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}


let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`→ MODIFED '${__filename}'`))
    delete require.cache[file]
    require(file)
    throw new Error('Ini Memang Di buat Error Untuk menghentikan kode dan memulai ulang ');
})

setInterval(() => {
    if (ttlerr > 3) {
        console.log(chalk.white.bgRed.bold('Crash by → Connection Loop'))
        throw new Error('Bot Crash → By sitotes anti loop')
    } else {
        ttlerr = ttlerr * 0
    }
}, 60000)