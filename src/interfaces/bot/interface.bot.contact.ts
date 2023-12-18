import { Imessage } from "./interface.bot.message"

export default interface Icontact {
    _id:number,
    isGroup: boolean
    name?: string | null,
    picture?: string | null,
    msgs?: Imessage[],
    id?: string | null,
    newMessages?:number,
    botId?:string
}

