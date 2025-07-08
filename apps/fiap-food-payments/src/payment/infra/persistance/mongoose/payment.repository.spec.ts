import {
    AggregateMergeContext,
    TransactionManager,
} from '@fiap-food/tactical-design/core';
import { FakeMongooseModel } from '@fiap-foodest-factory/utils';
import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentRepository } from '../../../application/abstractions/payment.repository';
import { MongoosePaymentSchemaFactory } from './payment-schema.factory';
import { MongoosePaymentRepository } from './payment.repository';
import { MongoosePaymentSchema } from './payment.schema';

describe('MongoosePaymentRepository', () => {
  let app: INestApplication;
  let target: PaymentRepository;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TransactionManager,
          useValue: Object.create(TransactionManager.prototype),
        },
        {
          provide: getModelToken(MongoosePaymentSchema.name),
          useClass: FakeMongooseModel,
        },
        {
          provide: MongoosePaymentSchemaFactory,
          useValue: Object.create(MongoosePaymentSchemaFactory.prototype),
        },
        {
          provide: AggregateMergeContext,
          useValue: Object.create(AggregateMergeContext.prototype),
        },
        {
          provide: PaymentRepository,
          useClass: MongoosePaymentRepository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    target = app.get(PaymentRepository);
  });

  it('should instantiate correctly', async () => {
    expect(target).toBeInstanceOf(MongoosePaymentRepository);
  });
});
