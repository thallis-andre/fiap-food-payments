import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  EPaymentStatus,
  PaymentStatusValues,
} from '../../domain/values/payment-status.value';
import { PaymentType } from '../../domain/values/payment.types';

export class Payment {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly amount: number;

  @ApiProperty()
  public readonly type: PaymentType;

  @ApiProperty({ enum: EPaymentStatus })
  public readonly status: PaymentStatusValues;

  @ApiPropertyOptional()
  public readonly conciliationId?: string;

  @ApiPropertyOptional()
  public readonly content?: string;

  @ApiProperty()
  public readonly createdAt: Date;

  @ApiPropertyOptional()
  public readonly updatedAt?: Date;

  @ApiPropertyOptional()
  public readonly approvedAt?: Date;

  @ApiPropertyOptional()
  public readonly rejectedAt?: Date;

  constructor({
    id,
    amount,
    type,
    status,
    conciliationId,
    content,
    createdAt,
    updatedAt,
    approvedAt,
    rejectedAt,
  }: Payment) {
    this.id = id;
    this.amount = amount;
    this.type = type;
    this.status = status;
    this.conciliationId = conciliationId;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.approvedAt = approvedAt;
    this.rejectedAt = rejectedAt;
  }
}
