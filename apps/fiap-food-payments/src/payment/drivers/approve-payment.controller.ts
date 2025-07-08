import { Controller, Param, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApprovePaymentCommand } from '../application/commands/approve-payment.command';

@Controller({ version: '1', path: 'payments' })
export class ApprovePaymentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id/approve')
  async execute(@Param('id') id: string) {
    await this.commandBus.execute<ApprovePaymentCommand>(
      new ApprovePaymentCommand(id),
    );
  }
}
