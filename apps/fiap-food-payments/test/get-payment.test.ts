import { destroyTestApp } from '@fiap-food/test-factory/utils';
import { INestApplication } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Types } from 'mongoose';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from './create-app';

describe('GET /v1/payments/:id', () => {
  let app: INestApplication;
  let server: App;

  beforeAll(async () => {
    app = await createTestApp();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await destroyTestApp(app);
  });

  it('should return existing payment', async () => {
    const payment = { type: 'PixQrCode', amount: 999.99 };
    const draftPaymentResponse = await request(server)
      .post('/v1/payments')
      .send(payment);

    const { statusCode, body } = draftPaymentResponse;
    expect(statusCode).toBe(201);
    expect(body).toEqual({ id: expect.any(String) });
    const { id: paymentId } = body;
    const paymentResponse = await request(server).get(
      `/v1/payments/${paymentId}`,
    );
    expect(paymentResponse.statusCode).toBe(200);
    expect(paymentResponse.body).toEqual(
      expect.objectContaining({ id: paymentId, status: expect.any(String) }),
    );
  });

  it('should return 400 when an invalid Id is provided', async () => {
    const paymentId = randomUUID();
    const paymentResponse = await request(server).get(
      `/v1/payments/${paymentId}`,
    );
    expect(paymentResponse.statusCode).toBe(400);
  });

  it('should return 404 when a valid id is provided but no payment is found', async () => {
    const paymentId = new Types.ObjectId();
    const paymentResponse = await request(server).get(
      `/v1/payments/${paymentId}`,
    );
    expect(paymentResponse.statusCode).toBe(404);
  });
});
