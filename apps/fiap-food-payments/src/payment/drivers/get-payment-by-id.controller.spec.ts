import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { GetPaymentByIdQuery } from '../application/queries/get-payment-by-id.query';
import { GetPaymentByIdController } from './get-payment-by-id.controller';

describe('GetPaymentByIdController', () => {
  let target: GetPaymentByIdController;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [GetPaymentByIdController],
    }).compile();

    target = app.get(GetPaymentByIdController);
    queryBus = app.get(QueryBus);
  });

  it('should return existing payment', async () => {
    jest.spyOn(queryBus, 'execute').mockResolvedValue({ data: { id: '123' } });
    const id = randomUUID();
    const result = await target.execute(id);
    expect(result.id).toBe('123');
    expect(queryBus.execute).toHaveBeenCalledWith(new GetPaymentByIdQuery(id));
  });

  it('should throw if commandBus throws', async () => {
    const err = new Error('Too Bad');
    jest.spyOn(queryBus, 'execute').mockRejectedValue(err);

    await expect(() => target.execute('123')).rejects.toThrow(err);
    expect(queryBus.execute).toHaveBeenCalledWith(
      new GetPaymentByIdQuery('123'),
    );
  });
});
