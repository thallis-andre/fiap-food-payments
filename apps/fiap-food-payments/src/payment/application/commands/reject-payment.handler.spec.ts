import { TransactionManager } from '@fiap-food/tactical-design/core';
import {
  FakeRepository,
  FakeTransactionManager,
} from '@fiap-foodest-factory/utils';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { Payment } from '../../domain/entities/payment.aggregate';
import { StatusTransitionException } from '../../domain/errors/status-transition.exception';
import { PaymentRejected } from '../../domain/events/payment.rejected';
import { PaymentInstructionFactory } from '../../domain/factories/payment-instruction.factory';
import { PaymentStatusFactory } from '../../domain/values/payment-status.value';
import { PaymentRepository } from '../abstractions/payment.repository';
import { RejectPaymentCommand } from './reject-payment.command';
import { RejectPaymentHandler } from './reject-payment.handler';

describe('RejectPaymentHandler', () => {
  let app: INestApplication;
  let target: RejectPaymentHandler;
  let repository: PaymentRepository;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        RejectPaymentHandler,
        {
          provide: TransactionManager,
          useClass: FakeTransactionManager,
        },
        {
          provide: PaymentRepository,
          useClass: FakeRepository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    target = app.get(RejectPaymentHandler);
    repository = app.get(PaymentRepository);
  });

  it('should transition payment status to rejected and notify', async () => {
    const payment = new Payment(
      new Types.ObjectId().toHexString(),
      199,
      'PixQRCode',
      PaymentStatusFactory.create('Created'),
      PaymentInstructionFactory.create('PixQRCode', '123', '123'),
    );
    jest.spyOn(payment as any, 'onPaymentRejected');
    jest.spyOn(repository, 'findById').mockResolvedValue(payment);
    jest.spyOn(repository, 'update').mockResolvedValue();
    const command = new RejectPaymentCommand(payment.id);
    await target.execute(command);
    expect(repository.update).toHaveBeenCalled();
    expect((payment as any).onPaymentRejected).toHaveBeenCalledWith(
      new PaymentRejected(),
    );
  });

  it('should throw if payment is in incorrect status', async () => {
    const payment = new Payment(
      new Types.ObjectId().toHexString(),
      199,
      'PixQRCode',
      PaymentStatusFactory.create('Approved'),
      null,
    );
    jest.spyOn(payment as any, 'onPaymentRejected');
    jest.spyOn(repository, 'findById').mockResolvedValue(payment);
    jest.spyOn(repository, 'update').mockResolvedValue();
    const command = new RejectPaymentCommand(payment.id);
    await expect(() => target.execute(command)).rejects.toThrow(
      StatusTransitionException,
    );
  });
});
