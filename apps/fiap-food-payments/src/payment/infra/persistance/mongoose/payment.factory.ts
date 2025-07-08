import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { PaymentFactory } from '../../../application/abstractions/payment.factory';
import { PaymentRepository } from '../../../application/abstractions/payment.repository';
import { Payment } from '../../../domain/entities/payment.aggregate';
import { PaymentStatusFactory } from '../../../domain/values/payment-status.value';
import { PaymentType } from '../../../domain/values/payment.types';

@Injectable()
export class MongoosePaymentFactory implements PaymentFactory {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async create(type: PaymentType, amount: number): Promise<Payment> {
    const payment = new Payment(
      new Types.ObjectId().toHexString(),
      amount,
      type,
      PaymentStatusFactory.draft(),
      null,
    );
    await this.paymentRepository.create(payment);
    return payment;
  }
}
