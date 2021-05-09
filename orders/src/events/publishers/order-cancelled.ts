import { OrderCancelledEvent, Publisher, subjects } from '@eg-ticketing/common';

export class OrderCancelledEventPublisher extends Publisher<OrderCancelledEvent> {
	readonly subject = subjects.OrderCancelled;
}
