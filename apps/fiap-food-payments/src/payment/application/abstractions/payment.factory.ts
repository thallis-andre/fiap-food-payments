import { EntityFactory } from '@fiap-food/tactical-design/core';
import { Payment } from '../../domain/entities/payment.aggregate';
import { PaymentType } from '../../domain/values/payment.types';

export abstract class PaymentFactory implements EntityFactory<Payment> {
  abstract create(type: PaymentType, amount: number): Promise<Payment>;
}
