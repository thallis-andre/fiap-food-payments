import { PixQRCodeService } from '@fiap-food/external-providers/pix';
import PIX from '@fiap-food/external-providers/pix/pix';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PixService } from './pix.service';

describe('PixService', () => {
  let app: INestApplication;
  let target: PixService;
  let provider: PixQRCodeService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PixQRCodeService,
          useValue: Object.create(PixQRCodeService.prototype),
        },
        PixService,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    target = app.get(PixService);
    provider = app.get(PixQRCodeService);
  });

  it('should create a pix qrcode and return conciliation id and content', async () => {
    jest.spyOn(provider, 'createPixQRCode').mockResolvedValue(
      new PIX({
        pixkey: 'jack@sparrow.com',
        merchant: 'dummy',
        amount: 123,
        city: 'nowhere',
      }),
    );
    const result = await target.createPixQRCode(123);
    expect(result.conciliationId).toBeDefined();
    expect(result.content).toBeDefined();
  });
});
