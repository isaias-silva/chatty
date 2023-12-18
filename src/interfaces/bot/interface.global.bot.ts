import { PrismaClient } from "@prisma/client";
import { Contact, proto, } from "@whiskeysockets/baileys";
import { Channel } from "amqplib";
import TelegramBot from "node-telegram-bot-api";
import { Server, Socket } from "socket.io";
import cron from 'node-cron'
import Flow from "src/bots/flow";
import { BotconfigService } from "src/services/botconfig.service";
import Icontact from "./interface.bot.contact";
import { IsendMessage } from "./interface.bot.send";
import { IGlobalGroups } from "./interface.bot.groups";
import { StatusBot } from "src/enums/StatusBot";

type botCreds = {
    name?: string
    number?: string,
    profile?: string
}
type flowData =
    {
        chatId: string,
        name: string, id: string, flowCount: number, close: boolean, responses: {
            name: string,
            response: string
        }[]
    }

export interface IGlobalBot {

    type: 'WA' | 'TEL'
    status: StatusBot,
    pastStatus: StatusBot,

    id: string | undefined,
    botId: string,
    mode: 'sniper' | 'attendant' | 'repasse',
    clientServer: Server,
    flows: Flow[],
    socketsCount: number,
    idClient: string,
    socket?: any | TelegramBot;
    info?: Contact;
    idDominated?: string
    prisma?: PrismaClient
    sleep: boolean
    channel?: Channel

    markedIds: string[]

    jobs: cron.ScheduledTask[]

    observer: boolean,
    wellcome: IsendMessage,
    bye: IsendMessage


    flow: string
    
    setIo: (socket: Socket) => void

    removeIo: (socket: Socket) => void

    start: () => Promise<void>

    kill: (over?: boolean) => Promise<void>

    sendMessage: (jid: string, text: string) => Promise<void>

    sendImage: (jid: string, buff: Buffer, text: string) => Promise<void>

    sendVideo: (jid: string, buff: Buffer, text: string) => Promise<void>

    sendAudio: (jid: string, buff: Buffer, ppt: boolean) => Promise<void>

    sendDocument: (jid: string, buff: Buffer, text: string, mimetype: string, filename?: string) => Promise<void>

    readMessages: (id: string) => Promise<void>

    getMyChats: () => Promise<IGlobalGroups[]>

    defineAndSendMessage: (messageSend: IsendMessage, id: string) => void

    extractInfo: () => Promise<botCreds>
    consumeRepasse: () => Promise<void>
    consumeMessages: () => Promise<void>
    cachMessages: (contact: Icontact) => Promise<void>
    emitMessageNew: (contact: Icontact) => Promise<void>
    storeMessages: (message: Icontact) => Promise<void>
    startFlow: (jid: string, flowId: string,name?:string) => Promise<void>
    getFlows: () => Promise<flowData[]>
    repasse: (sendMessage: IsendMessage) => Promise<void>
    stopFlow: (id: string) => Promise<void>


}