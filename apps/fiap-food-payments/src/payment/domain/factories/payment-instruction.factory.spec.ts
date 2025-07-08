import { randomUUID } from 'crypto';
import { PixQRCode } from '../values/pix-qrcode.value';
import { PaymentInstructionFactory } from './payment-instruction.factory';

describe('PaymentInstructionFactory', () => {
  it('should instantiate a payment instruction', () => {
    const content = 'dummy123';
    const id = randomUUID();
    const target = PaymentInstructionFactory.create('PixQRCode', content, id);
    expect(target.type).toBe(PixQRCode.name);
    expect(target.content).toBe(content);
    expect(target.conciliationId).toBe(id);
  });

  it('should throw error if invalid instruction type is provided', () => {
    expect(() =>
      PaymentInstructionFactory.create('XXX' as any, 'content', 'id'),
    ).toThrow('Missing payment instruction XXX');
  });
});
