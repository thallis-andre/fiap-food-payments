import { randomUUID } from 'crypto';
import { PaymentApproved } from '../events/payment.approved';
import { PaymentCreated } from '../events/payment.created';
import { PaymentDrafted } from '../events/payment.drafted';
import { PaymentRejected } from '../events/payment.rejected';
import {
  EPaymentStatus,
  PaymentStatusFactory,
} from '../values/payment-status.value';
import { Payment } from './payment.aggregate';

const createSpyedTarget = () => {
  const target = new Payment(
    randomUUID(),
    123,
    'PixQRCode',
    PaymentStatusFactory.draft(),
    null,
  );

  jest.spyOn(target as any, 'applyEvent');
  return target;
};

describe('Payment', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  describe('.draft()', () => {
    it('should draft payment', () => {
      const target = createSpyedTarget();
      target.draft();

      expect((target as any).applyEvent).toHaveBeenCalledWith(
        expect.objectContaining(new PaymentDrafted(target.type, target.amount)),
      );
    });
  });

  describe('.create()', () => {
    it('should transition payment to created status', () => {
      const target = createSpyedTarget();
      target.draft();
      const conciliationId = randomUUID();
      const content = randomUUID();
      target.create(content, conciliationId);

      expect((target as any).applyEvent).toHaveBeenCalledWith(
        expect.objectContaining(new PaymentCreated(conciliationId, content)),
      );
      expect(target.status).toBe(EPaymentStatus.Created);
      expect(target.paymentInstruction.conciliationId).toBe(conciliationId);
      expect(target.paymentInstruction.content).toBe(content);
    });
  });

  describe('.approve()', () => {
    it('should transition payment to approved status', () => {
      const target = createSpyedTarget();
      target.draft();
      const conciliationId = randomUUID();
      const content = randomUUID();
      target.create(content, conciliationId);
      target.approve();

      expect((target as any).applyEvent).toHaveBeenCalledWith(
        expect.objectContaining(new PaymentApproved()),
      );
      expect(target.status).toBe(EPaymentStatus.Approved);
      expect(target.approvedAt).toBeDefined();
    });
  });

  describe('.reject()', () => {
    it('should transition payment to rejected status', () => {
      const target = createSpyedTarget();
      target.draft();
      const conciliationId = randomUUID();
      const content = randomUUID();
      target.create(content, conciliationId);
      target.reject();

      expect((target as any).applyEvent).toHaveBeenCalledWith(
        expect.objectContaining(new PaymentRejected()),
      );
      expect(target.status).toBe(EPaymentStatus.Rejected);
      expect(target.rejectedAt).toBeDefined();
    });
  });
  describe('.approve()', () => {
    it('should transition payment to approved status', () => {
      const target = createSpyedTarget();
      target.draft();
      const conciliationId = randomUUID();
      const content = randomUUID();
      target.create(content, conciliationId);
      target.approve();

      expect((target as any).applyEvent).toHaveBeenCalledWith(
        expect.objectContaining(new PaymentApproved()),
      );
      expect(target.status).toBe(EPaymentStatus.Approved);
    });
  });
});
