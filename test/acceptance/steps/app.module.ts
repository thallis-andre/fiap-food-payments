import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PaymentSuite } from './step-definitions/payment.suite';
@Module({
  imports: [HttpModule],
  providers: [PaymentSuite],
})
export class AppModule {}
