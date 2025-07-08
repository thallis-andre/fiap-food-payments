export enum EPaymentStatus {
  Drafted = 'Drafted',
  Created = 'Created',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

import { StatusTransitionException } from '../errors/status-transition.exception';

export type PaymentStatusValues = `${EPaymentStatus}`;

export abstract class PaymentStatus {
  protected abstract readonly _value: PaymentStatusValues;

  get value() {
    return this._value;
  }

  draft(): PaymentStatus {
    throw new StatusTransitionException(this._value, EPaymentStatus.Drafted);
  }

  create(): PaymentStatus {
    throw new StatusTransitionException(this._value, EPaymentStatus.Created);
  }

  approve(): PaymentStatus {
    throw new StatusTransitionException(this._value, EPaymentStatus.Approved);
  }

  reject(): PaymentStatus {
    throw new StatusTransitionException(this._value, EPaymentStatus.Rejected);
  }
}

class DraftedPaymentStatus extends PaymentStatus {
  protected readonly _value = EPaymentStatus.Drafted;

  create(): PaymentStatus {
    return new CreatedPaymentStatus();
  }

  approve(): PaymentStatus {
    return new ApprovedPaymentStatus();
  }

  reject(): PaymentStatus {
    return new RejectedPaymentStatus();
  }
}

class CreatedPaymentStatus extends PaymentStatus {
  protected readonly _value = EPaymentStatus.Created;

  approve(): PaymentStatus {
    return new ApprovedPaymentStatus();
  }

  reject(): PaymentStatus {
    return new RejectedPaymentStatus();
  }
}

class ApprovedPaymentStatus extends PaymentStatus {
  protected readonly _value = EPaymentStatus.Approved;
}

class RejectedPaymentStatus extends PaymentStatus {
  protected readonly _value = EPaymentStatus.Rejected;
}

export class PaymentStatusFactory {
  private static readonly values: Record<
    PaymentStatusValues,
    new () => PaymentStatus
  > = {
    Drafted: DraftedPaymentStatus,
    Created: CreatedPaymentStatus,
    Approved: ApprovedPaymentStatus,
    Rejected: RejectedPaymentStatus,
  };

  static draft() {
    return new DraftedPaymentStatus();
  }

  static create(value: PaymentStatusValues) {
    const Status = this.values[value];
    if (!Status) {
      throw new Error(`Missing constructor for status value ${value}`);
    }

    return new Status();
  }
}
