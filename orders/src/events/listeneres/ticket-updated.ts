import { Listener, subjects, TicketCreatedEvent, TicketUpdatedEvent } from "@eg-ticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { QUEUE_GROUP_NAME } from "./queue-group-name";


export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = subjects.TicketUpdated
    queueGroupName = QUEUE_GROUP_NAME

    async onMessage(data: TicketCreatedEvent["data"], message: Message) {
        const { title, price, id } = data
        const ticket = await Ticket.findById(id)

        if (!ticket) throw new Error("Ticket not found")

        ticket.set({ title, price })

        await ticket.save()
    }
}