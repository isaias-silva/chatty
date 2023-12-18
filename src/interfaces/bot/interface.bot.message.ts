import { MediaType, proto } from "@whiskeysockets/baileys"

export interface Imessage {
    _id:number
    text?: string | null,
    type?: 'text' | 'warking' | 'image' | 'sticker' | 'video' | 'audio' | 'doc' | 'quoted'|string
    name?: string | null
    number?: string
    media?: { data: string | null, type?: MediaType|any, mimetype?: string | null }
    picture?: string | null
    isMe?: boolean
    quoted?: boolean
    read?: boolean
    msgQuoted?: Imessage
    msgObject?: proto.IMessage | null
    date?:string
}