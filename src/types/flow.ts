type ToolsFlow = {
    timer: {
        messageEndId: string,
        time: number,
        delay: number
    }
}
type BodyMessage = {
    messageType: typeMessageBody
    text: string;
    media?: Buffer;
} & {
    messageType: typeMessageBody
    text: string;
    media?: Buffer;
    keywords?: string[];
    _idError?: string;
} & {
    messageType: typeMessageBody
    text: string,
    media?: Buffer,
    opts?: { name: string, _idProx: string }[]
} & {
    messageType: typeMessageBody
    text: string,
    media?: Buffer
}

type BodyTypeMap = {
    store: {
        messageType: typeMessageBody
        text: string,
        media?: Buffer
    },
    question: {
        messageType: typeMessageBody
        text: string,
        media?: Buffer,
        keywords: string[],
        _idError: string
    }
    options: {
        messageType: typeMessageBody
        text: string,
        media?: Buffer,
        opts: { name: string, _idProx: string }[]
    },
    call: {
        messageType: typeMessageBody
        text: string,
        media?: Buffer
    }
};


type GetBodyType<T extends keyof BodyTypeMap> = BodyTypeMap[T];
type typeMessage = "store" | "question" | "options" | "call" | "void";
type typeMessageBody = 'text' | 'image' | 'menu' | 'video' | 'audio' | 'file'