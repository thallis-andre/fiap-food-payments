import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  GetPaymentByIdQuery,
  GetPaymentByIdResult,
} from '../application/queries/get-payment-by-id.query';
import { ObjectIdValidationPipe } from '../infra/pipes/object-id-validation.pipe';

@Controller({ version: '1', path: 'payments' })
export class GetPaymentByIdController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':id')
  async execute(@Param('id', new ObjectIdValidationPipe()) id: string) {
    const result = await this.queryBus.execute<
      GetPaymentByIdQuery,
      GetPaymentByIdResult
    >(new GetPaymentByIdQuery(id));
    return result.data;
  }
}
