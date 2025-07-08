import { Transactional } from '@fiap-food/tactical-design/core';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentProvider } from '../abstractions/payment.provider';
import { PaymentRepository } from '../abstractions/payment.repository';
import { CreatePaymentCommand } from './create-payment.command';

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandler
  implements ICommandHandler<CreatePaymentCommand, void>
{
  constructor(
    private readonly repository: PaymentRepository,
    private readonly paymentProvider: PaymentProvider,
  ) {}

  @Transactional()
  async execute({ id }: CreatePaymentCommand): Promise<void> {
    const payment = await this.repository.findById(id);
    const { conciliationId, content } =
      await this.paymentProvider.createPixQRCode(payment.amount);
    payment.create(content, conciliationId);
    await this.repository.update(payment);
    await payment.commit();
  }
}
