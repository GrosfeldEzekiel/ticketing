import { natsWrapper, OrderCreatedEvent, OrderStatus } from "@eg-ticketing/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"
import { OrderCreatedListener } from "../order-created"

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client)

    const ticket = Ticket.build({ userId: 'fake', title: 'Concert', price: 20 })
    await ticket.save()

    const data: OrderCreatedEvent["data"] = {
        id: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        ticket: {
            id: ticket.id,
            price: 10,
        },
        userId: 'fake',
        expiresAt: 'fakeExpirtation',
    }

    const message: Pick<Message, 'ack'> = {
        ack: jest.fn()
    }

    return { listener, ticket, data, message }
}

it("Should successfully set the id of the order inside the ticket", async () => {
    const { listener, ticket, data, message } = await setup()

    await listener.onMessage(data, message as Message)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.orderId).toEqual(data.id)

})

it("Should successfully acks the message", async () => {
    const { listener, ticket, data, message } = await setup()

    await listener.onMessage(data, message as Message)

    expect(message.ack).toHaveBeenCalled()
})