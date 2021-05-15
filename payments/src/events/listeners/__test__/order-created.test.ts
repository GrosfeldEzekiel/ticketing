import { natsWrapper, OrderCreatedEvent, OrderStatus } from '@eg-ticketing/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { OrderCreatedListener } from '../order-created';

const setup = async () => {
	const listener = new OrderCreatedListener(natsWrapper.client);

	const data: OrderCreatedEvent['data'] = {
		id: mongoose.Types.ObjectId().toHexString(),
		status: OrderStatus.Created,
		ticket: {
			id: 'random',
			price: 10,
		},
		userId: 'fake',
		expiresAt: 'fakeExpirtation',
	};

	const message: Pick<Message, 'ack'> = {
		ack: jest.fn(),
	};

	return { listener, data, message };
};

it('Should successfully create orde on internal DB', async () => {
	const { listener, data, message } = await setup();

	await listener.onMessage(data, message as Message);

	const createdOrder = await Order.findById(data.id);

	expect(createdOrder!.id).toEqual(data.id);
	expect(createdOrder!.price).toEqual(data.ticket.price);
});

it('Should successfully acks the message', async () => {
	const { listener, data, message } = await setup();

	await listener.onMessage(data, message as Message);

	expect(message.ack).toHaveBeenCalled();
});
