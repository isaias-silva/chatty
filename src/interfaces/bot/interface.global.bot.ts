
import cron from 'node-cron'


import Icontact from "./interface.bot.contact";
import { IsendMessage } from "./interface.bot.send";
import { IGlobalGroups } from "./interface.bot.groups";
import { StatusBot } from "../../enums/StatusBot";
import Flow from "../../class/Flow";

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

    status: StatusBot,
    pastStatus: StatusBot,

    id: string | undefined,
    botId: string,
    mode: 'sniper' | 'attendant' | 'repasse',
  
    flows: Flow[],
    socketsCount: number,
    idClient: string,
   
    
    idDominated?: string
   
    sleep: boolean
  

    markedIds: string[]

    jobs: cron.ScheduledTask[]

    observer: boolean,
    wellcome: IsendMessage,
    bye: IsendMessage


    flow: string
    
    
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