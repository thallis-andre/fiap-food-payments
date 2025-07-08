import { TransactionManager } from '@fiap-food/tactical-design/core';
import { FakeTransactionManager } from '@fiap-foodest-factory/utils';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { Payment } from '../../domain/entities/payment.aggregate';
import { PaymentStatusFactory } from '../../domain/values/payment-status.value';
import { MongoosePaymentFactory } from '../../infra/persistance/mongoose/payment.factory';
import { PaymentFactory } from '../abstractions/payment.factory';
import { DraftPaymentInput } from '../dtos/draft-payment.input';
import { DraftPaymentCommand } from './draft-payment.command';
import { DraftPaymentHandler } from './draft-payment.handler';

describe('DraftPaymentHandler', () => {
  let app: INestApplication;
  let target: DraftPaymentHandler;
  let entityFactory: PaymentFactory;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        DraftPaymentHandler,
        {
          provide: TransactionManager,
          useClass: FakeTransactionManager,
        },
        {
          provide: PaymentFactory,
          useValue: Object.create(MongoosePaymentFactory.prototype),
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    target = app.get(DraftPaymentHandler);
    entityFactory = app.get(PaymentFactory);
  });

  it('should create a new payment entity through entity factory', async () => {
    const payment = new Payment(
      new Types.ObjectId().toHexString(),
      199,
      'PixQRCode',
      PaymentStatusFactory.draft(),
      null,
    );
    const command = new DraftPaymentCommand({
      amount: payment.amount,
      type: payment.type,
    });
    jest.spyOn(entityFactory, 'create').mockResolvedValue(payment);
    const result = await target.execute(command);
    expect(result.data.id).toBe(payment.id);
  });

  it('should throw if payment factory throws', async () => {
    const input = new DraftPaymentInput();
    input.amount = 199;
    input.type = 'PixQRCode';
    const command = new DraftPaymentCommand(input);
    const err = new Error('Entity already existss');
    jest.spyOn(entityFactory, 'create').mockRejectedValue(err);
    await expect(() => target.execute(command)).rejects.toThrow(err);
  });
});
