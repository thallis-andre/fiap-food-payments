import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { RejectPaymentCommand } from '../application/commands/reject-payment.command';
import { RejectPaymentController } from './reject-payment.controller';

describe('RejectPaymentController', () => {
  let target: RejectPaymentController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [RejectPaymentController],
    }).compile();

    target = app.get(RejectPaymentController);
    commandBus = app.get(CommandBus);
  });

  it('should execute reject payment command', async () => {
    const id = randomUUID();
    jest.spyOn(commandBus, 'execute').mockResolvedValue(null);
    await target.execute(id);
    expect(commandBus.execute).toHaveBeenCalledWith(
      new RejectPaymentCommand(id),
    );
  });

  it('should throw if commandBus throws', async () => {
    const id = randomUUID();
    const err = new Error('Too Bad');
    jest.spyOn(commandBus, 'execute').mockRejectedValue(err);
    await expect(() => target.execute(id)).rejects.toThrow(err);
    expect(commandBus.execute).toHaveBeenCalledWith(
      new RejectPaymentCommand(id),
    );
  });
});
