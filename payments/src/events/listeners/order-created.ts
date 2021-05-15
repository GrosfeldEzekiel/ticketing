import { Listener, OrderCreatedEvent, subjects } from '@eg-ticketing/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = subjects.OrderCreated;

	queueGroupName = QUEUE_GROUP_NAME;

	async onMessage(data: OrderCreatedEvent['data'], message: Message) {
		const order = await Order.build({
			id: data.id,
			price: data.ticket.price,
			status: data.status,
			userId: data.userId,
		});

		await order.save();

		message.ack();
	}
}
