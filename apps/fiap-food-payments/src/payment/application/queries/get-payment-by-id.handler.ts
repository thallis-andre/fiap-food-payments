import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MongoosePaymentSchema } from '../../infra/persistance/mongoose/payment.schema';
import { Payment } from '../dtos/payment.dto';
import {
  GetPaymentByIdQuery,
  GetPaymentByIdResult,
} from './get-payment-by-id.query';

@QueryHandler(GetPaymentByIdQuery)
export class GetPaymentByIdHandler
  implements IQueryHandler<GetPaymentByIdQuery, GetPaymentByIdResult>
{
  constructor(
    @InjectModel(MongoosePaymentSchema.name)
    private readonly queryModel: Model<MongoosePaymentSchema>,
  ) {}

  async execute({ id }: GetPaymentByIdQuery): Promise<GetPaymentByIdResult> {
    const result = await this.queryModel
      .findById(new Types.ObjectId(id))
      .exec();

    if (!result) {
      throw new NotFoundException();
    }

    return new GetPaymentByIdResult(
      new Payment({
        id: result._id.toHexString(),
        amount: result.amount,
        status: result.status as any,
        type: result.type as any,
        conciliationId: result.paymentInstruction?.conciliationId,
        content: result.paymentInstruction?.content,
        approvedAt: result.approvedAt,
        rejectedAt: result.rejectedAt,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      }),
    );
  }
}
