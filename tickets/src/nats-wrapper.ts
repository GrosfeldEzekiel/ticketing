import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  #client?: Stan;

  get client() {
    if (!this.#client)
      throw new Error("Cannot access NATS client before connecting");

    return this.#client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this.#client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });

      this.client.on("error", (e) => reject(e));
    });
  }
}

export const natsWrapper = new NatsWrapper();
