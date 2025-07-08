import { DomainEvent } from '@fiap-food/tactical-design/core';

export class PaymentApproved extends DomainEvent {
  public readonly approvedAt = new Date();
}
