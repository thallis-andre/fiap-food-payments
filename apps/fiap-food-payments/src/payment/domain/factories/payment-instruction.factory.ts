import { PixQRCode } from '../values/pix-qrcode.value';

const MAPPINGS = {
  [PixQRCode.name]: PixQRCode,
};

type PaymentInstructionFactoryInput = 'PixQRCode';

export class PaymentInstructionFactory {
  static create(
    type: PaymentInstructionFactoryInput,
    content: string,
    conciliationId: string,
  ) {
    const PaymentInstruction = MAPPINGS[type];

    if (!PaymentInstruction) {
      throw new Error(`Missing payment instruction ${type}`);
    }

    return new PaymentInstruction(conciliationId, content);
  }
}
