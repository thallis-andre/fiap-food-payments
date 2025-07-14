import { TransactionManager } from '@fiap-food/tactical-design/core';
import {
    FakeRepository,
    FakeTransactionManager,
} from '@fiap-food/test-factory/utils';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { Payment } from '../../domain/entities/payment.aggregate';
import { PaymentCreated } from '../../domain/events/payment.created';
import { PaymentStatusFactory } from '../../domain/values/payment-status.value';
import { PixService } from '../../infra/adapters/pix/pix.service';
import { PaymentProvider } from '../abstractions/payment.provider';
import { PaymentRepository } from '../abstractions/payment.repository';
import { CreatePaymentCommand } from './create-payment.command';
import { CreatePaymentHandler } from './create-payment.handler';

describe('CreatePaymentHandler', () => {
  let app: INestApplication;
  let target: CreatePaymentHandler;
  let repository: PaymentRepository;
  let provider: PaymentProvider;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePaymentHandler,
        {
          provide: TransactionManager,
          useClass: FakeTransactionManager,
        },
        {
          provide: PaymentRepository,
          useClass: FakeRepository,
        },
        {
          provide: PaymentProvider,
          useValue: Object.create(PixService.prototype),
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    target = app.get(CreatePaymentHandler);
    repository = app.get(PaymentRepository);
    provider = app.get(PaymentProvider);
  });

  it('should create a new payment entity through entity factory', async () => {
    const payment = new Payment(
      new Types.ObjectId().toHexString(),
      199,
      'PixQRCode',
      PaymentStatusFactory.draft(),
      null,
    );
    jest.spyOn(payment as any, 'onPaymentCreated');
    jest.spyOn(repository, 'findById').mockResolvedValue(payment);
    jest.spyOn(repository, 'update').mockResolvedValue();
    jest
      .spyOn(provider, 'createPixQRCode')
      .mockResolvedValue({ conciliationId: '123', content: '123' });
    const command = new CreatePaymentCommand(payment.id);
    await target.execute(command);
    expect(repository.update).toHaveBeenCalled();
    expect(provider.createPixQRCode).toHaveBeenCalled();
    expect((payment as any).onPaymentCreated).toHaveBeenCalledWith(
      new PaymentCreated('123', '123'),
    );
  });
});
