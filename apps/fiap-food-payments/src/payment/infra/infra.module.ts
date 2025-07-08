import { PixProviderModule } from '@fiap-food/external-providers/pix';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentFactory } from '../application/abstractions/payment.factory';
import { PaymentProvider } from '../application/abstractions/payment.provider';
import { PaymentRepository } from '../application/abstractions/payment.repository';
import { PixService } from './adapters/pix/pix.service';
import { MongoosePaymentSchemaFactory } from './persistance/mongoose/payment-schema.factory';
import { MongoosePaymentFactory } from './persistance/mongoose/payment.factory';
import { MongoosePaymentRepository } from './persistance/mongoose/payment.repository';
import {
  MongoosePaymentSchema,
  MongoosePaymentSchemaModel,
} from './persistance/mongoose/payment.schema';

const MongooseSchemaModule = MongooseModule.forFeature([
  {
    name: MongoosePaymentSchema.name,
    schema: MongoosePaymentSchemaModel,
  },
]);

MongooseSchemaModule.global = true;

@Module({
  imports: [MongooseSchemaModule, PixProviderModule],
  providers: [
    MongoosePaymentSchemaFactory,
    {
      provide: PaymentProvider,
      useClass: PixService,
    },
    {
      provide: PaymentFactory,
      useClass: MongoosePaymentFactory,
    },
    {
      provide: PaymentRepository,
      useClass: MongoosePaymentRepository,
    },
  ],
  exports: [PaymentFactory, PaymentRepository, PaymentProvider],
})
export class InfraModule {}
