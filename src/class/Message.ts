import { IMessageFlow } from "../interfaces/flow/interface.message.flow";


export class MessageFlow implements IMessageFlow {

    name: string;
    _id: string;
    _idProx: string | null = null;
    type: typeMessage
    body: BodyMessage

    setProx(id: string) {
        this._idProx = id
    }

    constructor(name: string, type: typeMessage, body: BodyMessage, id: string) {
        this._id = id
        this.name = name
        this.type = type
        this.body = body
    }


}