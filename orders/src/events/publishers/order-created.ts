import { OrderCreatedEvent, Publisher, subjects } from "@eg-ticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = subjects.OrderCreated;
}
