import faker from '@faker-js/faker';
import { Ticket, TicketStatus, TicketType } from '@prisma/client';
import { prisma } from '@/config';

export async function createTicketType() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: faker.datatype.boolean(),
      includesHotel: faker.datatype.boolean(),
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}

export async function createTicketTypeRemote() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: true,
      includesHotel: faker.datatype.boolean(),
    },
  });
}

export async function createTicketTypeWithHotel() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: true,
    },
  });
}

export async function ticketWithTypeFactory(status: boolean, isRemote: boolean, includesHotel: boolean) {
  const testTicket: Ticket & { TicketType: TicketType } = {
    id: 1,
    ticketTypeId: 1,
    enrollmentId: 1,
    status: status ? 'PAID' : 'RESERVED',
    createdAt: new Date(),
    updatedAt: new Date(),
    TicketType: {
      id: 1,
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote,
      includesHotel,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
  return testTicket;
}

export function createFakeTicket(status: string, isRemote: boolean, includesHotel: boolean){
  const fakeTicket = {
    id: 300,
    ticketTypeId: 353,
    enrollmentId: 429,
    status: 'PAID',
    createdAt: faker.datatype.datetime(),
    updatedAt: faker.datatype.datetime(),
    TicketType: {
      id: 353,
      name: 'Devin Von',
      price: 11661,
      isRemote: false,
      includesHotel: true,
      createdAt: faker.datatype.datetime(),
      updatedAt: faker.datatype.datetime()
    }
  }

  return fakeTicket;
}
