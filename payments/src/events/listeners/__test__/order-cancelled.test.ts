import {
	natsWrapper,
	OrderCancelledEvent,
	OrderStatus,
} from '@eg-ticketing/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { OrderCancelledListener } from '../order-cancelled';

const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client);

	const order = Order.build({
		id: mongoose.Types.ObjectId().toHexString(),
		price: 10,
		userId: 'random',
		status: OrderStatus.Created,
	});

	await order.save();

	const data: OrderCancelledEvent['data'] = {
		id: order.id,
		ticket: {
			id: 'random',
		},
	};

	const message: Pick<Message, 'ack'> = {
		ack: jest.fn(),
	};

	return { listener, data, message };
};

it('Should successfully set the order Id to undefined', async () => {
	const { listener, data, message } = await setup();

	await listener.onMessage(data, message as Message);

	const updatedOrder = await Order.findById(data.id);

	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('Should successfully acks the message', async () => {
	const { listener, data, message } = await setup();

	await listener.onMessage(data, message as Message);

	expect(message.ack).toHaveBeenCalled();
});
