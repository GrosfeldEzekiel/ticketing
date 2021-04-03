import { Publisher, subjects, TicketCreatedEvent } from "@eg-ticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = subjects.TicketCreated;
}
