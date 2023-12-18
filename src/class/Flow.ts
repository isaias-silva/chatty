import { IGlobalBot } from "../interfaces/bot/interface.global.bot"
import { IMessageFlow } from "../interfaces/flow/interface.message.flow"
import { MessageFlow } from "./Message"
import cron from 'node-cron'
export default class Flow {
    id: string
    responses: { name: string, response: string }[] = []

    private messages: IMessageFlow[] = []
    private sent: IMessageFlow[] = []
    private first?: IMessageFlow
    private prox?: IMessageFlow
    close: boolean = false
    flowCount: number | undefined
    jid: string | undefined;
    bot: IGlobalBot
    name: string
    private clientName: string | undefined
    private loadResponse: boolean = false
    private response: string | undefined
    private jobs: cron.ScheduledTask[] = []
    private tools: ToolsFlow

    constructor(name: string,
        bot: IGlobalBot,
        messages: MessageFlow[],
        id: string,
        tools: ToolsFlow) {

        this.id = id
        this.bot = bot
        this.name = name
        this.messages = messages
        this.tools = tools
    }


    async startTools() {
        const { timer } = this.tools
        if (timer) {
            const jobTimer = cron.schedule(`* * * * * *`, async () => {

                if (this.loadResponse) {

                    await this.waitSeconds(timer.time)

                    if (timer.messageEndId && !this.close) {
                        this.loadResponse = false

                        this.prox = this.messages.find(value => value._id == timer.messageEndId)
                        if (this.prox) {
                            await this.sendMessage(this.prox)

                        }

                        await this.endFlow(false)

                        this.close = true


                    }
                }
            })
            this.jobs.push(jobTimer)
            jobTimer.start()

        }
    }
    private waitSeconds(seconds: number) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    async start(jid: string) {
        this.startTools()


        this.jid = jid
        this.first = this.messages[0]



        this.prox = this.first.type == 'options' ? this.first : this.messages.find(value => value._id == this.first?._idProx)

        await this.sendMessage(this.first)
        this.loadResponse = true



        const jobTimer = cron.schedule(`*/${this.tools.timer.delay} * * * * *`, async () => {

            if (this.response && this.loadResponse) {
                this.loadResponse = false


            }

        })
        const job = cron.schedule(`*/2 * * * * *`, async () => {


            if ((!this.loadResponse && this.response) || this.first?.type == 'void') {

                if (this.first)
                    await this.treatingResponse(this.first, this.response)

                if (this.prox) {
                    await this.sendMessage(this.prox)
                } else {
                    this.close = true
                    this.endFlow(false)
                }

            }
        })
        job.start()

        jobTimer.start()


        this.jobs = [jobTimer, job]

    }

    private async endFlow(desistance: boolean) {


        this.jobs.map(job => {
            job.stop();

        })

        if (desistance) {
            this.responses.map(value => {
                if (!value.response || value.response.length < 2) {
                    value.response = "não respondeu."
                }
                value.response = value.response.replace(/undefined/g, " ").replace(/null/g, " ")
                return value
            })
        }
        const obj = {
            bot: this.bot.botId,
            responses: this.responses,
            participant: { id: this.jid, name: this.clientName }

        }
        console.table(this.responses)

    }
    private setResponse(text: string) {
        if (this.response) {
            this.response = this.response + " " + text
        } else {
            this.response = text
        }


    }
    private async treatingResponse(message: IMessageFlow, response?: string,) {



        if ((!message || this.loadResponse) && message.type != 'void') {

            return
        }

        switch (message.type) {
            case 'store':
                if (response)
                    await this.treatingStore(message, response)
                break

            case 'options':
                if (response)
                    await this.treatingOption(message, response)
                break

            case 'question':
                if (response)
                    await this.treatingQuestion(message, response)
                break

            case 'call':
                if (response)
                    await this.treatingCall(message, response)
                break
            case 'void':

                await this.treatingVoid(message)
                break


        }
        this.response = undefined
        let delay = this.tools.timer.delay / this.sent.length
        this.tools.timer.delay = delay > 0 ? delay : 2


        this.first = this.prox


    }

    private async sendMessage(message: IMessageFlow) {


        this.sent.push(message)

        const { sendAudio, sendMessage, sendImage, sendVideo } = this.bot
        if (!this.jid) {
            return
        }
        switch (message.body.messageType) {


            case 'audio':
                if (message.body.media)
                    sendAudio(this.jid, message.body.media, true)
                break

            case 'image':
                if (message.body.media)
                    sendImage(this.jid, message.body.media, message.body.text)

                break
            case 'text':
                sendMessage(this.jid, message.body.text)
                break
            case 'menu':

                if (message.body.opts) {
                    let messageTemplate = `${message.body.text}\n`
                    message.body.opts.forEach((value, i) => {
                        messageTemplate += (`\n[ ${i} ] - ${value.name}`)
                    })
                    if (message.body.media) {
                        sendImage(this.jid, message.body.media, message.body.text)
                    } else {
                        sendMessage(this.jid, messageTemplate)

                    }
                }
                break
            case 'video':
                if (message.body.media)
                    sendVideo(this.jid, message.body.media, message.body.text)

                break
        }
    }
    private async treatingOption(message: IMessageFlow, response: string) {

        const { sendMessage } = this.bot

        if (message.body.opts) {
            const [optSelected] = message.body.opts.filter((value, i) => {
                try {
                    const numberRes = parseInt(response)
                    return i == numberRes
                } catch (err) {
                    return value.name == response

                }

            })

            if (!optSelected && this.jid) {
                await sendMessage(this.jid, 'opção inválida')
                return
            }

            this.prox = this.messages.find(value => value._id == optSelected._idProx)

            this.addResponses(message.name, optSelected.name)


        }
        else {
            this.prox = undefined
        }


    }
    private async treatingStore(message: IMessageFlow, response: string) {


        this.addResponses(message.name, response)


        if (message._idProx) {

            this.prox = this.messages.find(value => value._id == message._idProx)
        } else {
            this.prox = undefined
        }
    }
    private async treatingQuestion(message: IMessageFlow, response: string) {

        if (message.body.keywords) {
            let validRes: boolean = false
            message.body.keywords.forEach((value) => {
                if (response.toLowerCase().includes(value.trim().toLowerCase())) {
                    validRes = true
                }
            })
            this.addResponses(message.name, response)

            if (validRes) {
                this.prox = this.messages.find(value => value._id == message._idProx)

            } else {
                this.prox = this.messages.find(value => value._id == message.body._idError)
            }
        }

    }
    private async treatingCall(message: IMessageFlow, response: string) {

        this.close = true
    }
    
    private async treatingVoid(message: IMessageFlow) {

        if (message._idProx) {
            this.prox = this.messages.find(value => value._id == message._idProx)
        } else {
            this.prox = undefined
        }
        this.first = this.prox

    }

    private addResponses(name: string, value: string) {

        const exists = this.responses.find(v => v.name == name)
        if (exists) {
            exists.response = value
        } else {
            this.responses.push({ name, response: value })

        }
    }
    setClientName(name: string) {
        this.clientName = name
    }
    async stop() {
        this.close = true
        await this.endFlow(false)
    }
}