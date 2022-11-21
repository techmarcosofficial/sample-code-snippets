import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Store } from 'src/modules/stores/schemas/store.schema';
import { TypeOfOperation } from '../../type_of_operations/schemas/type_of_operation.schema';

export type LicenseDocument = License & Document;

@Schema()
export class License {
  @Prop({ type: String })
  itw_user_id: string;

  @Prop({ type: String })
  itw_opportunity_id: string;

  @Prop({ type: String })
  opportunity_id: string;

  @Prop({ type: String })
  license_type: string;

  @Prop({ type: String })
  license_number: string;

  @Prop({ type: Number })
  license_cost: number

  // @Prop({ type: String })
  // license_state: string;

  @Prop({ type: Date })
  license_effective_date: Date;

  @Prop({ type: Date })
  license_expiry_date: Date;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Store', required: true })
  store: Store;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'TypeOfOperation', required: true })
  type_of_operation: TypeOfOperation;

  @Prop({ type: Boolean, default: true })
  deleted_at_itw: Boolean;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;
}

export const LicenseSchema = SchemaFactory.createForClass(License);
