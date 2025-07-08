import { Transactional } from '@fiap-food/tactical-design/core';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentRepository } from '../abstractions/payment.repository';
import { RejectPaymentCommand } from './reject-payment.command';

@CommandHandler(RejectPaymentCommand)
export class RejectPaymentHandler
  implements ICommandHandler<RejectPaymentCommand, void>
{
  constructor(private readonly repository: PaymentRepository) {}

  @Transactional()
  async execute({ id }: RejectPaymentCommand): Promise<void> {
    const payment = await this.repository.findById(id);
    payment.reject();
    await this.repository.update(payment);
    await payment.commit();
  }
}
