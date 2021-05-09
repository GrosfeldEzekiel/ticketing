import mongoose from 'mongoose';
import {
	ExpirationCompleteEvent,
	natsWrapper,
	OrderStatus,
} from '@eg-ticketing/common';
import { ExpirationCompleteListener } from '../expiration-complete';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';
import { Message } from 'node-nats-streaming';
import { OrderCreatedPublisher } from '../../publishers/order-created';

const setup = async () => {
	const listener = new ExpirationCompleteListener(natsWrapper.client);

	const ticket = Ticket.build({
		title: 'concert',
		price: 20,
		id: mongoose.Types.ObjectId().toHexString(),
	});

	await ticket.save();

	const order = Order.build({
		userId: mongoose.Types.ObjectId().toHexString(),
		expiresAt: new Date(),
		ticket: ticket.id,
		status: OrderStatus.Created,
	});

	await order.save();

	const data: ExpirationCompleteEvent['data'] = {
		orderId: order.id,
	};

	const message: Pick<Message, 'ack'> = {
		ack: jest.fn(),
	};

	return { listener, order, ticket, data, message };
};

it('Should successfully updates order status to cancelled', async () => {
	const { listener, order, data, message } = await setup();

	await listener.onMessage(data, message as Message);

	const updatedOrder = await Order.findById(order.id);

	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('Should successfully emit order cancelled event', async () => {
	const { listener, order, data, message } = await setup();

	await listener.onMessage(data, message as Message);

	expect(natsWrapper.client.publish).toHaveBeenCalled();

	const eventData = JSON.parse(
		(natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
	);

	expect(eventData.id).toEqual(order.id);
});

it('Should successfully ack the message', async () => {
	const { listener, data, message } = await setup();

	await listener.onMessage(data, message as Message);

	expect(message.ack).toHaveBeenCalled();
});
