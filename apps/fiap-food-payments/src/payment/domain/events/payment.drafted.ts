import { DomainEvent } from '@fiap-food/tactical-design/core';

export class PaymentDrafted extends DomainEvent {
  constructor(
    public readonly type: string,
    public readonly amount: number,
  ) {
    super();
  }
}
