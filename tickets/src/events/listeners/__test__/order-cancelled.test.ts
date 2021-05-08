import { natsWrapper, OrderCancelled } from '@eg-ticketing/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { OrderCancelledListener } from '../order-cancelled';

const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client);

	const ticket = Ticket.build({ userId: 'fake', title: 'Concert', price: 20 });
	await ticket.save();

	const data: OrderCancelled['data'] = {
		id: mongoose.Types.ObjectId().toHexString(),
		ticket: {
			id: ticket.id,
		},
	};

	const message: Pick<Message, 'ack'> = {
		ack: jest.fn(),
	};

	return { listener, ticket, data, message };
};

it('Should successfully set the order Id to undefined', async () => {
	const { listener, ticket, data, message } = await setup();

	await listener.onMessage(data, message as Message);

	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.orderId).toEqual(undefined);
});

it('Should successfully acks the message', async () => {
	const { listener, ticket, data, message } = await setup();

	await listener.onMessage(data, message as Message);

	expect(message.ack).toHaveBeenCalled();
});

it('Should publish a ticket updated event', async () => {
	const { listener, ticket, data, message } = await setup();

	await listener.onMessage(data, message as Message);

	expect(natsWrapper.client.publish).toHaveBeenCalled();

	expect((natsWrapper.client.publish as jest.Mock).mock.calls[0][0]).toEqual(
		'ticket:updated'
	);
});
