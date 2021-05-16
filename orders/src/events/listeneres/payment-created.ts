import {
	Listener,
	NotFoundError,
	OrderStatus,
	PaymentCreatedEvent,
	subjects,
} from '@eg-ticketing/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
	readonly subject = subjects.PaymentCreated;

	queueGroupName = QUEUE_GROUP_NAME;

	async onMessage(data: PaymentCreatedEvent['data'], message: Message) {
		const order = await Order.findById(data.orderId);

		if (!order) throw new NotFoundError();

		order.set({ status: OrderStatus.Complete });

		await order.save();

		message.ack();
	}
}
