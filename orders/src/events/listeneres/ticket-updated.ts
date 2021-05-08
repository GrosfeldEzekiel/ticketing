import { Listener, subjects, TicketCreatedEvent, TicketUpdatedEvent } from "@eg-ticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { QUEUE_GROUP_NAME } from "./queue-group-name";


export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = subjects.TicketUpdated
    queueGroupName = QUEUE_GROUP_NAME

    async onMessage(data: TicketCreatedEvent["data"], message: Message) {
        const { title, price, id, version } = data
        const ticket = await Ticket.findById(id)

        if (!ticket) return

        if (ticket.version !== version - 1) return

        ticket.set({ title, price, version })

        await ticket.save()

        message.ack()
    }
}