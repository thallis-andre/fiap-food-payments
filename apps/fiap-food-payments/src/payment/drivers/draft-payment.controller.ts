import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  DraftPaymentCommand,
  DraftPaymentResult,
} from '../application/commands/draft-payment.command';
import { DraftPaymentInput } from '../application/dtos/draft-payment.input';

@Controller({ version: '1', path: 'payments' })
export class DraftPaymentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async execute(@Body() data: DraftPaymentInput) {
    const result = await this.commandBus.execute<
      DraftPaymentCommand,
      DraftPaymentResult
    >(new DraftPaymentCommand(data));

    return result.data;
  }
}
