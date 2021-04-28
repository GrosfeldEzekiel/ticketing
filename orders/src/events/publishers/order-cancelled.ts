import { OrderCancelled, Publisher, subjects } from "@eg-ticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelled> {
  readonly subject = subjects.OrderCancelled;
}
