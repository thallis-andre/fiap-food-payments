import { StatusTransitionException } from '../errors/status-transition.exception';
import {
  EPaymentStatus,
  PaymentStatusFactory,
  PaymentStatusValues,
} from './payment-status.value';

describe('PaymentStatus', () => {
  describe('PaymentStatusFactory.draft', () => {
    it('should instantiate PaymentStatus for the Drafted state', () => {
      const target = PaymentStatusFactory.draft();
      expect(target.value).toBe(EPaymentStatus.Drafted);
    });
  });

  describe('PaymentStatusFactory.create', () => {
    it('should throw error if no status exists for value', () => {
      expect(() => PaymentStatusFactory.create('UNKNOWN' as any)).toThrow(
        'Missing constructor for status value UNKNOWN',
      );
    });
  });

  describe.each([
    EPaymentStatus.Drafted,
    EPaymentStatus.Created,
    EPaymentStatus.Approved,
    EPaymentStatus.Rejected,
  ])('PaymentStatusFactory.create', (value: EPaymentStatus) => {
    it(`should instantiate PaymentStatus for the ${value} state`, () => {
      const target = PaymentStatusFactory.create(value);
      expect(target.value).toBe(value);
    });
  });

  describe.each([
    [EPaymentStatus.Drafted, EPaymentStatus.Drafted, false],
    [EPaymentStatus.Drafted, EPaymentStatus.Created, true],
    [EPaymentStatus.Drafted, EPaymentStatus.Approved, true],
    [EPaymentStatus.Drafted, EPaymentStatus.Rejected, true],
    [EPaymentStatus.Created, EPaymentStatus.Drafted, false],
    [EPaymentStatus.Created, EPaymentStatus.Created, false],
    [EPaymentStatus.Created, EPaymentStatus.Approved, true],
    [EPaymentStatus.Created, EPaymentStatus.Rejected, true],
    [EPaymentStatus.Approved, EPaymentStatus.Drafted, false],
    [EPaymentStatus.Approved, EPaymentStatus.Created, false],
    [EPaymentStatus.Approved, EPaymentStatus.Approved, false],
    [EPaymentStatus.Approved, EPaymentStatus.Rejected, false],
    [EPaymentStatus.Rejected, EPaymentStatus.Drafted, false],
    [EPaymentStatus.Rejected, EPaymentStatus.Created, false],
    [EPaymentStatus.Rejected, EPaymentStatus.Approved, false],
    [EPaymentStatus.Rejected, EPaymentStatus.Rejected, false],
  ])('Payment Status Transitions', (from, to, success) => {
    it(`should not allow transition from ${from} to ${to}`, () => {
      const target = PaymentStatusFactory.create(from as PaymentStatusValues);
      const methods: Record<EPaymentStatus, string> = {
        [EPaymentStatus.Drafted]: 'draft',
        [EPaymentStatus.Created]: 'create',
        [EPaymentStatus.Approved]: 'approve',
        [EPaymentStatus.Rejected]: 'reject',
      };
      const method = methods[to];
      if (success) {
        const actual = target[method]();
        expect(actual.value).toBe(to);
      } else {
        expect(() => target[method]()).toThrow(
          new StatusTransitionException(from, to),
        );
      }
    });
  });
});
