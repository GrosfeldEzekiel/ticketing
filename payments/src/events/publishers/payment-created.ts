import { PaymentCreatedEvent, Publisher, subjects } from '@eg-ticketing/common';

export class PaymentCreatedpublisher extends Publisher<PaymentCreatedEvent> {
	readonly subject = subjects.PaymentCreated;
}
