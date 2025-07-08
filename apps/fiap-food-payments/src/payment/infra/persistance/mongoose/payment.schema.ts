import { MongooseEntitySchema } from '@fiap-food/tactical-design/mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PaymentType } from '../../../domain/values/payment.types';

@Schema({ _id: false })
export class MongoosePaymentInstructionSchema {
  @Prop()
  conciliationId: string;

  @Prop()
  type: string;

  @Prop()
  content: string;
}

@Schema({ collection: 'Payments', timestamps: true })
export class MongoosePaymentSchema extends MongooseEntitySchema {
  @Prop()
  amount: number;

  @Prop()
  status: string;

  @Prop({ type: String })
  type: PaymentType;

  @Prop({ schema: MongoosePaymentInstructionSchema })
  paymentInstruction: MongoosePaymentInstructionSchema;

  @Prop()
  approvedAt?: Date;

  @Prop()
  rejectedAt?: Date;
}

export const MongoosePaymentSchemaModel = SchemaFactory.createForClass(
  MongoosePaymentSchema,
);
