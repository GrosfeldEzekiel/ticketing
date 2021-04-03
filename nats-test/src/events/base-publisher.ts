import { Stan } from "node-nats-streaming";
import { subjects } from "./subjects";

interface Event {
  subject: subjects;
  data: unknown;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) reject(err);
        console.info("Event published Successfully to", this.subject);
        resolve();
      });
    });
  }
}
