import { Payment } from '../dtos/payment.dto';

export class GetPaymentByIdQuery {
  constructor(public readonly id: string) {}
}

export class GetPaymentByIdResult {
  constructor(public readonly data: Payment) {}
}
