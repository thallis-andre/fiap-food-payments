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
import { PaymentApproved } from '../../domain/events/payment.approved';
import { PaymentInstructionFactory } from '../../domain/factories/payment-instruction.factory';
import { PaymentStatusFactory } from '../../domain/values/payment-status.value';
import { PaymentRepository } from '../abstractions/payment.repository';
import { ApprovePaymentCommand } from './approve-payment.command';
import { ApprovePaymentHandler } from './approve-payment.handler';

describe('ApprovePaymentHandler', () => {
  let app: INestApplication;
  let target: ApprovePaymentHandler;
  let repository: PaymentRepository;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        ApprovePaymentHandler,
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
    target = app.get(ApprovePaymentHandler);
    repository = app.get(PaymentRepository);
  });

  it('should transition payment status to approved and notify', async () => {
    const payment = new Payment(
      new Types.ObjectId().toHexString(),
      199,
      'PixQRCode',
      PaymentStatusFactory.create('Created'),
      PaymentInstructionFactory.create('PixQRCode', '123', '123'),
    );
    jest.spyOn(payment as any, 'onPaymentApproved');
    jest.spyOn(repository, 'findById').mockResolvedValue(payment);
    jest.spyOn(repository, 'update').mockResolvedValue();
    const command = new ApprovePaymentCommand(payment.id);
    await target.execute(command);
    expect(repository.update).toHaveBeenCalled();
    expect((payment as any).onPaymentApproved).toHaveBeenCalledWith(
      new PaymentApproved(),
    );
  });

  it('should throw if payment is in incorrect status', async () => {
    const payment = new Payment(
      new Types.ObjectId().toHexString(),
      199,
      'PixQRCode',
      PaymentStatusFactory.create('Rejected'),
      null,
    );
    jest.spyOn(payment as any, 'onPaymentApproved');
    jest.spyOn(repository, 'findById').mockResolvedValue(payment);
    jest.spyOn(repository, 'update').mockResolvedValue();
    const command = new ApprovePaymentCommand(payment.id);
    await expect(() => target.execute(command)).rejects.toThrow(
      StatusTransitionException,
    );
  });
});
