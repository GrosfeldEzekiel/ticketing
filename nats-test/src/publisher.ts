import nats from "node-nats-streaming";
import { TicketCreatePublisher } from "./events/ticket-created-publisher";

console.clear();

// Client
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const publisher = new TicketCreatePublisher(stan);

  await publisher.publish({
    id: "id",
    title: "My title",
    price: "20",
  });
});
