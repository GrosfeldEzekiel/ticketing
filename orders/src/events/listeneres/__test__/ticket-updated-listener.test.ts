import { natsWrapper, TicketUpdatedEvent } from '@eg-ticketing/common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedListener } from '../ticket-updated';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'My Event',
    price: 100,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const data: TicketUpdatedEvent['data'] = {
    version: 1,
    id: ticket.id,
    title: 'Awsome Title',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  //@ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message, ticket };
};

it('Should update and save a ticket', async () => {
  const { listener, data, message, ticket: prevTicket } = await setup();

  await listener.onMessage(data, message);

  const updatedTicket = await Ticket.findById(prevTicket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.__v).toEqual(1);
});

it('Should ack the message', async () => {
  const { listener, data, message } = await setup();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});
