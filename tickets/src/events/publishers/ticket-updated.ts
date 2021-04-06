import { Publisher, subjects, TicketUpdatedEvent } from "@eg-ticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = subjects.TicketUpdated;
}
