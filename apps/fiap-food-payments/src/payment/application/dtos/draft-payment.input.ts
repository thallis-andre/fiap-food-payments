import { IsNumber, IsString } from 'class-validator';
import { PaymentType } from '../../domain/values/payment.types';

export class DraftPaymentInput {
  @IsString()
  type: PaymentType;

  @IsNumber()
  amount: number;
}

export class DraftPaymentOutput {
  id: string;
}
