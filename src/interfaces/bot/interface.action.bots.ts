import { Action } from "src/enums/Actions";
import Icontact from "./interface.bot.contact";

export interface IAction {
    action: Action,
    details: {
        contact: { name?: string, picture?: string, jid: string }
    },
}