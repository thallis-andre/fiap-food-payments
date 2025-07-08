import { AggregateRoot } from '@fiap-food/tactical-design/core';
import { PaymentApproved } from '../events/payment.approved';
import { PaymentCreated } from '../events/payment.created';
import { PaymentDrafted } from '../events/payment.drafted';
import { PaymentRejected } from '../events/payment.rejected';
import { PaymentInstructionFactory } from '../factories/payment-instruction.factory';
import { PaymentInstruction } from '../values/payment-instruction.value';
import {
  PaymentStatus,
  PaymentStatusFactory,
  PaymentStatusValues,
} from '../values/payment-status.value';
import { PaymentType } from '../values/payment.types';

export class Payment extends AggregateRoot {
  constructor(
    protected readonly _id: string,
    private readonly _amount: number,
    private readonly _type: PaymentType,
    private _status: PaymentStatus,
    private _paymentInstruction: PaymentInstruction,
    private _approvedAt?: Date,
    private _rejectedAt?: Date,
  ) {
    super(_id);
  }

  get amount() {
    return this._amount;
  }

  get type() {
    return this._type;
  }

  get status(): PaymentStatusValues {
    return this._status.value;
  }

  get paymentInstruction() {
    return this._paymentInstruction?.value;
  }

  get approvedAt() {
    return this._approvedAt;
  }

  get rejectedAt() {
    return this._rejectedAt;
  }

  draft() {
    this.apply(new PaymentDrafted(this._type, this.amount));
  }

  protected onPaymentDrafted() {
    this._status = PaymentStatusFactory.draft();
  }

  create(content: string, conciliationId: string) {
    this.apply(new PaymentCreated(conciliationId, content));
  }

  protected onPaymentCreated({ content, conciliationId }: PaymentCreated) {
    this._paymentInstruction = PaymentInstructionFactory.create(
      'PixQRCode',
      content,
      conciliationId,
    );
    this._status = this._status.create();
  }

  approve() {
    this.apply(new PaymentApproved());
  }

  protected onPaymentApproved({ approvedAt }: PaymentApproved) {
    this._status = this._status.approve();
    this._approvedAt = approvedAt;
  }

  reject() {
    this.apply(new PaymentRejected());
  }

  protected onPaymentRejected({ rejectedAt }: PaymentRejected) {
    this._rejectedAt = rejectedAt;
    this._status = this._status.reject();
  }
}
