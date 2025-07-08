export abstract class PaymentProvider {
  abstract createPixQRCode(amount: number): Promise<{
    conciliationId: string;
    content: string;
  }>;
}
