import {
  DraftPaymentInput,
  DraftPaymentOutput,
} from '../dtos/draft-payment.input';

export class DraftPaymentCommand {
  constructor(readonly data: DraftPaymentInput) {}
}

export class DraftPaymentResult {
  constructor(readonly data: DraftPaymentOutput) {}
}
