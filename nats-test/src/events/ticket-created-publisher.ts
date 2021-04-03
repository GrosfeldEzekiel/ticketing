import { Publisher } from "./base-publisher";
import { subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

export class TicketCreatePublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = subjects.TicketCreated;
}
