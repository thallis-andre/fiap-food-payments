import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { Payment } from '../../../domain/entities/payment.aggregate';
import { PaymentInstructionFactory } from '../../../domain/factories/payment-instruction.factory';
import {
  EPaymentStatus,
  PaymentStatusFactory,
} from '../../../domain/values/payment-status.value';
import { PixQRCode } from '../../../domain/values/pix-qrcode.value';
import { MongoosePaymentSchemaFactory } from './payment-schema.factory';
import { MongoosePaymentSchema } from './payment.schema';

describe('MongoosePaymentSchemaFactory', () => {
  let app: INestApplication;
  let target: MongoosePaymentSchemaFactory;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [MongoosePaymentSchemaFactory],
    }).compile();

    app = moduleFixture.createNestApplication();
    target = app.get(MongoosePaymentSchemaFactory);
  });

  it('should transform a Payment Entity into a MongooseSchema', async () => {
    const payment = new Payment(
      new Types.ObjectId().toHexString(),
      199,
      'PixQRCode',
      PaymentStatusFactory.draft(),
      null,
    );

    const result = target.entityToSchema(payment);
    expect(result._id).toBeInstanceOf(Types.ObjectId);
    expect(result).not.toBeInstanceOf(Payment);
  });

  it('should transform a MongooseSchema into a PaymentEntity', async () => {
    const payment: MongoosePaymentSchema = {
      _id: new Types.ObjectId(),
      amount: 199,
      paymentInstruction: null,
      status: EPaymentStatus.Drafted,
      type: 'PixQRCode',
    };
    const result = target.schemaToEntity(payment);
    expect(result.id).not.toBeInstanceOf(Types.ObjectId);
    expect(result.id).toBe(payment._id.toHexString());
    expect(result).toBeInstanceOf(Payment);
  });

  it('should transform a Payment Entity into a MongooseSchema with payment instruction', async () => {
    const payment = new Payment(
      new Types.ObjectId().toHexString(),
      199,
      'PixQRCode',
      PaymentStatusFactory.draft(),
      PaymentInstructionFactory.create('PixQRCode', '123', '123'),
    );

    const result = target.entityToSchema(payment);
    expect(result._id).toBeInstanceOf(Types.ObjectId);
    expect(result).not.toBeInstanceOf(Payment);
  });

  it('should transform a MongooseSchema into a PaymentEntity with payment instruction', async () => {
    const payment: MongoosePaymentSchema = {
      _id: new Types.ObjectId(),
      amount: 199,
      paymentInstruction: {
        conciliationId: '123',
        content: '123',
        type: PixQRCode.name,
      },
      status: EPaymentStatus.Drafted,
      type: 'PixQRCode',
    };
    const result = target.schemaToEntity(payment);
    expect(result.id).not.toBeInstanceOf(Types.ObjectId);
    expect(result.id).toBe(payment._id.toHexString());
    expect(result).toBeInstanceOf(Payment);
  });
});
