import { Controller, Param, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RejectPaymentCommand } from '../application/commands/reject-payment.command';

@Controller({ version: '1', path: 'payments' })
export class RejectPaymentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id/reject')
  async execute(@Param('id') id: string) {
    await this.commandBus.execute<RejectPaymentCommand>(
      new RejectPaymentCommand(id),
    );
  }
}
