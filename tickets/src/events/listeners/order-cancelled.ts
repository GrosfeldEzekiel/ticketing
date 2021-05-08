import {
	Listener,
	NotFoundError,
	OrderCancelled,
	subjects,
} from '@eg-ticketing/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelled> {
	readonly subject = subjects.OrderCancelled;

	queueGroupName = QUEUE_GROUP_NAME;

	async onMessage(data: OrderCancelled['data'], msg: Message) {
		const ticket = await Ticket.findById(data.ticket.id);

		if (!ticket) throw new NotFoundError();

		ticket.set({
			orderId: undefined,
		});

		await ticket.save();

		await new TicketUpdatedPublisher(this.client).publish({
			version: ticket.__v as number,
			id: ticket.id,
			price: ticket.price,
			title: ticket.title,
			userId: ticket.userId,
			orderId: ticket.orderId,
		});

		msg.ack();
	}
}
