import faker from '@faker-js/faker';
import { generateCPF, getStates } from '@brazilian-utils/brazilian-utils';
import { User } from '@prisma/client';

import { createUser } from './users-factory';
import { prisma } from '@/config';

export async function createEnrollmentWithAddress(user?: User) {
  const incomingUser = user || (await createUser());

  return prisma.enrollment.create({
    data: {
      name: faker.name.findName(),
      cpf: generateCPF(),
      birthday: faker.date.past(),
      phone: faker.phone.phoneNumber('(##) 9####-####'),
      userId: incomingUser.id,
      Address: {
        create: {
          street: faker.address.streetName(),
          cep: faker.address.zipCode(),
          city: faker.address.city(),
          neighborhood: faker.address.city(),
          number: faker.datatype.number().toString(),
          state: faker.helpers.arrayElement(getStates()).name,
        },
      },
    },
    include: {
      Address: true,
    },
  });
}

export function createhAddressWithCEP() {
  return {
    logradouro: 'Avenida Brigadeiro Faria Lima',
    complemento: 'de 3252 ao fim - lado par',
    bairro: 'Itaim Bibi',
    cidade: 'São Paulo',
    uf: 'SP',
  };
}

export function createFakeEnrollment(){
  const fakeEnrollmentId = faker.datatype.number({ min: 1 });
  const fakeEnrollment = {
    id: faker.datatype.number({ min: 1 }),
        name: faker.name.findName(),
        cpf: faker.random.numeric(11),
        birthday: faker.datatype.datetime(),
        phone: '(49) 90616-8699',
        userId: faker.datatype.number({ min: 1 }),
        createdAt: faker.datatype.datetime(),
        updatedAt: faker.datatype.datetime(),
        Address: [
          {
            id: fakeEnrollmentId,
            cep: '19246',
            street: faker.address.streetName(),
            city: faker.address.cityName(),
            state: faker.address.state(),
            number: faker.address.buildingNumber(),
            neighborhood: faker.address.streetName(),
            addressDetail: 'null',
            enrollmentId: fakeEnrollmentId,
            createdAt: faker.datatype.datetime(),
            updatedAt: faker.datatype.datetime(),
          },
        ]
  }

  return fakeEnrollment;
}