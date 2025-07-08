import { PixQRCodeService } from '@fiap-food/external-providers/pix';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PaymentProvider } from '../../../application/abstractions/payment.provider';

@Injectable()
export class PixService implements PaymentProvider {
  constructor(private readonly pixService: PixQRCodeService) {}

  private generateConciliationId() {
    const [, baseId] = randomUUID().split('-');
    const timestamp = new Date().toISOString().replace(/\D/g, '').slice(0, 16);
    return `${timestamp}${baseId}`;
  }

  async createPixQRCode(
    amount: number,
  ): Promise<{ conciliationId: string; content: string }> {
    const conciliationId = this.generateConciliationId();
    const transaction = await this.pixService.createPixQRCode(
      'payments@fiapfood.com.br',
      amount,
      'Fiap Food',
      'São Paulo',
      conciliationId,
    );
    return {
      conciliationId,
      content: transaction.payload(),
    };
  }
}
