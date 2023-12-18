export interface IsendMessage {
    text?: string,
    data?:IdataMessage
    type: 'text' | 'audio' | 'video' | 'image' | 'doc'
}
export interface IdataMessage {
    buffer?: string,
    mimetype?: string
}