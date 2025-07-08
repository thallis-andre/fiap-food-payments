import { EntitySchemaFactory } from '@fiap-food/tactical-design/core';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { Payment } from '../../../domain/entities/payment.aggregate';
import { PaymentInstructionFactory } from '../../../domain/factories/payment-instruction.factory';
import {
  PaymentStatusFactory,
  PaymentStatusValues,
} from '../../../domain/values/payment-status.value';
import { PaymentType } from '../../../domain/values/payment.types';
import { MongoosePaymentSchema } from './payment.schema';

@Injectable()
export class MongoosePaymentSchemaFactory
  implements EntitySchemaFactory<MongoosePaymentSchema, Payment>
{
  entityToSchema(entity: Payment): MongoosePaymentSchema {
    const instruction = entity.paymentInstruction;
    return {
      _id: new Types.ObjectId(entity.id),
      amount: entity.amount,
      status: entity.status,
      type: entity.type,
      paymentInstruction: instruction
        ? {
            conciliationId: instruction.conciliationId,
            content: instruction.content,
            type: instruction.type,
          }
        : null,
      approvedAt: entity.approvedAt,
      rejectedAt: entity.rejectedAt,
    };
  }

  schemaToEntity(entitySchema: MongoosePaymentSchema): Payment {
    const instruction = entitySchema.paymentInstruction;
    return new Payment(
      entitySchema._id.toHexString(),
      entitySchema.amount,
      entitySchema.type as PaymentType,
      PaymentStatusFactory.create(entitySchema.status as PaymentStatusValues),
      instruction
        ? PaymentInstructionFactory.create(
            instruction.type as any,
            instruction.content,
            instruction.conciliationId,
          )
        : null,
      entitySchema.approvedAt,
      entitySchema.rejectedAt,
    );
  }
}
