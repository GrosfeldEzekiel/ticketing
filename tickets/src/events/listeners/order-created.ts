import { Listener, NotFoundError, OrderCreatedEvent, subjects } from "@eg-ticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { QUEUE_GROUP_NAME } from "./queue-group-name";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = subjects.OrderCreated

    queueGroupName = QUEUE_GROUP_NAME

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id)

        if (!ticket) throw new NotFoundError()

        ticket.set({
            orderId: data.id
        })

        await ticket.save()

        msg.ack()
    }
}