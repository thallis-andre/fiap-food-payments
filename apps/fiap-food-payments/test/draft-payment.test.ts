import { destroyTestApp } from '@fiap-food/test-factory/utils';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setTimeout } from 'timers/promises';
import { createTestApp } from './create-app';

describe('POST /v1/payments', () => {
  let app: INestApplication;
  let server: App;

  beforeAll(async () => {
    app = await createTestApp();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await destroyTestApp(app);
  });

  it('should draft a new payment', async () => {
    const payment = { type: 'PixQrCode', amount: 999.99 };
    const draftPaymentResponse = await request(server)
      .post('/v1/payments')
      .send(payment);

    const { statusCode, body } = draftPaymentResponse;
    expect(statusCode).toBe(201);
    expect(body).toEqual({ id: expect.any(String) });

    await setTimeout(250);

    const { id: paymentId } = body;

    const paymentResponse = await request(server).get(
      `/v1/payments/${paymentId}`,
    );
    expect(paymentResponse.statusCode).toBe(200);
    expect(paymentResponse.body).toEqual(
      expect.objectContaining({ id: paymentId }),
    );
    expect(['Created', 'Drafted']).toContain(paymentResponse.body.status);
  });
});
