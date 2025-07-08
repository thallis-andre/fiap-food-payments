import { FakeRepository } from '@fiap-food/test-factory/utils';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentFactory } from '../../../application/abstractions/payment.factory';
import { PaymentRepository } from '../../../application/abstractions/payment.repository';
import { Payment } from '../../../domain/entities/payment.aggregate';
import { MongoosePaymentFactory } from './payment.factory';

describe('MongoosePaymentFactory', () => {
  let app: INestApplication;
  let target: PaymentFactory;
  let repository: PaymentRepository;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PaymentFactory,
          useClass: MongoosePaymentFactory,
        },
        {
          provide: PaymentRepository,
          useClass: FakeRepository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    target = app.get(PaymentFactory);
    repository = app.get(PaymentRepository);
  });

  it('should return instantiate a new Payment and perist it to the database', async () => {
    jest.spyOn(repository, 'create').mockResolvedValue();
    const amount = 199.33;
    const result = await target.create('PixQRCode', amount);
    expect(result).toBeInstanceOf(Payment);
    expect(result.amount).toBe(amount);
    expect(repository.create).toHaveBeenCalled();
  });
});
