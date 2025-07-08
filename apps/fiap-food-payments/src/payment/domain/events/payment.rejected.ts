import { DomainEvent } from '@fiap-food/tactical-design/core';

export class PaymentRejected extends DomainEvent {
  public readonly rejectedAt = new Date();
}
