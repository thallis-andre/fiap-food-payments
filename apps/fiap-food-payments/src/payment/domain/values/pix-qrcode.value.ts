import { PaymentInstruction } from './payment-instruction.value';

export class PixQRCode extends PaymentInstruction {
  readonly type = 'PixQRCode';
  constructor(
    protected readonly _conciliationId: string,
    protected readonly _content: string,
  ) {
    super();
  }

  get conciliationId() {
    return this._conciliationId;
  }

  get content() {
    return this._content;
  }
}
