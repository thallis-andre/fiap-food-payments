import { Transactional } from '@fiap-food/tactical-design/core';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentFactory } from '../abstractions/payment.factory';
import {
  DraftPaymentCommand,
  DraftPaymentResult,
} from './draft-payment.command';

@CommandHandler(DraftPaymentCommand)
export class DraftPaymentHandler
  implements ICommandHandler<DraftPaymentCommand, DraftPaymentResult>
{
  constructor(private readonly paymentFactory: PaymentFactory) {}

  @Transactional()
  async execute({ data }: DraftPaymentCommand): Promise<DraftPaymentResult> {
    const payment = await this.paymentFactory.create(data.type, data.amount);
    payment.draft();
    await payment.commit();
    return new DraftPaymentResult({ id: payment.id });
  }
}
