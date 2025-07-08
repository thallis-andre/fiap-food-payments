import { AmqpRetrialPolicy, AmqpSubscription } from '@fiap-food/amqp';
import { routingKeyOfEvent } from '@fiap-food/tactical-design/amqp';
import { AggregateEvent } from '@fiap-food/tactical-design/core';
import { Body, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { withPrefix } from '../../config/amqp.config';
import { CreatePaymentCommand } from '../application/commands/create-payment.command';
import { PaymentDrafted } from '../domain/events/payment.drafted';

@Injectable()
export class OnPaymentDraftedCreatePaymentController {
  constructor(private readonly commandBus: CommandBus) {}

  @AmqpSubscription({
    exchange: withPrefix('events'),
    routingKey: routingKeyOfEvent(PaymentDrafted),
    queue: withPrefix(CreatePaymentCommand.name),
  })
  @AmqpRetrialPolicy({
    delay: 5000,
    maxAttempts: 5,
    maxDelay: 5000,
  })
  async execute(@Body() data: any) {
    const { aggregateId } = data as AggregateEvent<PaymentDrafted>;
    await this.commandBus.execute(new CreatePaymentCommand(aggregateId));
  }
}
