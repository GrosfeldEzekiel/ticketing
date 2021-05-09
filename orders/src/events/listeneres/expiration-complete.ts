import {
	ExpirationCompleteEvent,
	Listener,
	NotFoundError,
	OrderStatus,
	subjects,
} from '@eg-ticketing/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { OrderCancelledEventPublisher } from '../publishers/order-cancelled';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
	readonly subject = subjects.ExpirationComplete;

	queueGroupName = QUEUE_GROUP_NAME;

	async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
		const order = await Order.findById(data.orderId).populate('ticket');

		if (!order) throw new NotFoundError();

		if (order!.status === OrderStatus.Complete) return msg.ack();

		order!.set({ status: OrderStatus.Cancelled });

		await order.save();

		await new OrderCancelledEventPublisher(this.client).publish({
			id: order.id,
			ticket: {
				id: order!.ticket.id,
			},
		});

		msg.ack();
	}
}
