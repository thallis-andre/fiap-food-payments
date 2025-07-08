import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { ApprovePaymentCommand } from '../application/commands/approve-payment.command';
import { ApprovePaymentController } from './approve-payment.controller';

describe('ApprovePaymentController', () => {
  let target: ApprovePaymentController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [ApprovePaymentController],
    }).compile();

    target = app.get(ApprovePaymentController);
    commandBus = app.get(CommandBus);
  });

  it('should execute approve payment command', async () => {
    const id = randomUUID();
    jest.spyOn(commandBus, 'execute').mockResolvedValue(null);
    await target.execute(id);
    expect(commandBus.execute).toHaveBeenCalledWith(
      new ApprovePaymentCommand(id),
    );
  });

  it('should throw if commandBus throws', async () => {
    const id = randomUUID();
    const err = new Error('Too Bad');
    jest.spyOn(commandBus, 'execute').mockRejectedValue(err);
    await expect(() => target.execute(id)).rejects.toThrow(err);
    expect(commandBus.execute).toHaveBeenCalledWith(
      new ApprovePaymentCommand(id),
    );
  });
});
