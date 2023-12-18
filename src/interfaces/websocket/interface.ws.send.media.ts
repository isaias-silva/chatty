interface IsendMediaItem {
    botId:string,
    type: "picture" | "audio" | "video" | "document",
    text: string,
    phone: string,
    mimetype: string
}
export default interface ISendMedia extends Array<IsendMediaItem & Buffer> { }