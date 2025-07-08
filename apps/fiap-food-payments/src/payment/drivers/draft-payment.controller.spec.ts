import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { DraftPaymentCommand } from '../application/commands/draft-payment.command';
import { DraftPaymentInput } from '../application/dtos/draft-payment.input';
import { DraftPaymentController } from './draft-payment.controller';

describe('DraftPaymentController', () => {
  let target: DraftPaymentController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [DraftPaymentController],
    }).compile();

    target = app.get(DraftPaymentController);
    commandBus = app.get(CommandBus);
  });

  it('should execute draft payment command', async () => {
    jest
      .spyOn(commandBus, 'execute')
      .mockResolvedValue({ data: { id: '123' } });
    const input = new DraftPaymentInput();
    input.amount = 199;
    input.type = 'PixQRCode';
    await target.execute(input);
    expect(commandBus.execute).toHaveBeenCalledWith(
      new DraftPaymentCommand(input),
    );
  });

  it('should throw if commandBus throws', async () => {
    const err = new Error('Too Bad');
    jest.spyOn(commandBus, 'execute').mockRejectedValue(err);
    const input = new DraftPaymentInput();
    input.amount = 199;
    input.type = 'PixQRCode';
    await expect(() => target.execute(input)).rejects.toThrow(err);
    expect(commandBus.execute).toHaveBeenCalledWith(
      new DraftPaymentCommand(input),
    );
  });
});
