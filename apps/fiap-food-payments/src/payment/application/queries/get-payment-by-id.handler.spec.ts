import { FakeMongooseModel } from '@fiap-food/test-factory/utils';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { Types } from 'mongoose';
import { EPaymentStatus } from '../../domain/values/payment-status.value';
import { MongoosePaymentSchema } from '../../infra/persistance/mongoose/payment.schema';
import { Payment } from '../dtos/payment.dto';
import { GetPaymentByIdHandler } from './get-payment-by-id.handler';
import {
  GetPaymentByIdQuery,
  GetPaymentByIdResult,
} from './get-payment-by-id.query';

describe('GetPaymentByIdHandler', () => {
  let app: INestApplication;
  let target: GetPaymentByIdHandler;
  let model: FakeMongooseModel<MongoosePaymentSchema>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        GetPaymentByIdHandler,
        {
          provide: getModelToken(MongoosePaymentSchema.name),
          useClass: FakeMongooseModel,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    target = app.get(GetPaymentByIdHandler);
    model = app.get(getModelToken(MongoosePaymentSchema.name));
  });

  it('should throw NotFound if payment does not exist', async () => {
    const query = new GetPaymentByIdQuery(new Types.ObjectId().toHexString());
    jest.spyOn(model, 'exec').mockResolvedValue(null);
    await expect(() => target.execute(query)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return existing payment for existing payments', async () => {
    const payment: MongoosePaymentSchema = {
      _id: new Types.ObjectId(),
      amount: 122.9,
      paymentInstruction: {
        conciliationId: randomUUID(),
        content: 'content123',
        type: 'dummy',
      },
      status: EPaymentStatus.Drafted,
      type: 'PixQRCode',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const query = new GetPaymentByIdQuery(payment._id.toHexString());
    jest.spyOn(model, 'exec').mockResolvedValue(payment);
    const result = await target.execute(query);
    expect(result).toBeInstanceOf(GetPaymentByIdResult);
    expect(result.data).toBeInstanceOf(Payment);
    expect(result.data.id).toBe(query.id);
  });
});
