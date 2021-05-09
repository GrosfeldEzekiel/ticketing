import {
	ExpirationCompleteEvent,
	Publisher,
	subjects,
} from '@eg-ticketing/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	readonly subject = subjects.ExpirationComplete;
}
