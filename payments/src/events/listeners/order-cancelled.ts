import { Listener, NotFoundError, OrderCancelledEvent, OrderStatus, subjects } from '@eg-ticketing/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
	readonly subject = subjects.OrderCancelled;

	queueGroupName = QUEUE_GROUP_NAME;

	async onMessage(data: OrderCancelledEvent['data'], message: Message) {
		const { id } = data;

		const order = await Order.findById(id);

		if (!order) throw new NotFoundError();

		order.set({
			status: OrderStatus.Cancelled,
		});

		await order.save();

		message.ack();
	}
}
