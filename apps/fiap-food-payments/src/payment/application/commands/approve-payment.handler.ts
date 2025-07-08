import { Transactional } from '@fiap-food/tactical-design/core';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentRepository } from '../abstractions/payment.repository';
import { ApprovePaymentCommand } from './approve-payment.command';

@CommandHandler(ApprovePaymentCommand)
export class ApprovePaymentHandler
  implements ICommandHandler<ApprovePaymentCommand, void>
{
  constructor(private readonly repository: PaymentRepository) {}

  @Transactional()
  async execute({ id }: ApprovePaymentCommand): Promise<void> {
    const payment = await this.repository.findById(id);
    payment.approve();
    await this.repository.update(payment);
    await payment.commit();
  }
}
