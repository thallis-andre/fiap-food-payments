export abstract class PaymentInstruction<T = string> /* NOSONAR */ {
  abstract type: string;
  abstract content: T;
  abstract conciliationId: string;

  get value() {
    return {
      type: this.type,
      conciliationId: this.conciliationId,
      content: this.content,
    };
  }
}
