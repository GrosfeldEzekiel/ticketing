import { Listener, subjects, TicketCreatedEvent } from "@eg-ticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { QUEUE_GROUP_NAME } from "./queue-group-name";


export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = subjects.TicketCreated
    queueGroupName = QUEUE_GROUP_NAME

    async onMessage(data: TicketCreatedEvent["data"], message: Message) {
        const { title, price, id } = data
        const ticket = Ticket.build({
            id,
            title,
            price
        })
        await ticket.save()

        message.ack()
    }
}