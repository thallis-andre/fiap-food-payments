import { Repository } from '@fiap-food/tactical-design/core';
import { Payment } from '../../domain/entities/payment.aggregate';

export abstract class PaymentRepository implements Repository<Payment> {
  abstract findById(id: string): Promise<Payment>;
  abstract findAll(): Promise<Payment[]>;
  abstract create(entity: Payment): Promise<void>;
  abstract update(entity: Payment): Promise<void>;
}
