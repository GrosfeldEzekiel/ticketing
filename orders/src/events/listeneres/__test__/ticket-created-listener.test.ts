import { natsWrapper, TicketCreatedEvent } from '@eg-ticketing/common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TicketCreatedListener } from '../ticket-created';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
	const listener = new TicketCreatedListener(natsWrapper.client);

	const data: TicketCreatedEvent['data'] = {
		version: 1,
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'Awsome Title',
		price: 10,
		userId: new mongoose.Types.ObjectId().toHexString(),
	};

	//@ts-ignore
	const message: Message = {
		ack: jest.fn(),
	};

	return { listener, data, message };
};

it('Should create and save a ticket', async () => {
	const { listener, data, message } = await setup();

	await listener.onMessage(data, message);

	const ticket = await Ticket.findById(data.id);

	expect(ticket).toBeDefined();
	expect(ticket!.title).toEqual(data.title);
	expect(ticket!.price).toEqual(data.price);
});

it('Should ack the message', async () => {
	const { listener, data, message } = await setup();

	await listener.onMessage(data, message);

	expect(message.ack).toHaveBeenCalled();
});
