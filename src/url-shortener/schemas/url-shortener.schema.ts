import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as shortId from 'shortid';
import { User } from '../../auth/schemas/users.schema';
import mongoose from 'mongoose';
import { AnalyticsInterface } from '../interfaces/analytics.interface';

@Schema({
  timestamps: true,
})
export class Analytics {
  @Prop()
  device: string;
  @Prop()
  clientName: string;
}
export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);

@Schema({
  timestamps: true,
})
export class UrlShortener {
  @Prop({ required: true })
  fullUrl: string;

  @Prop({ required: true, default: shortId.generate })
  shortUrl: string;

  @Prop({ required: true, default: 0 })
  clicks: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true })
  expireAt: Date;

  @Prop({ type: [AnalyticsSchema] })
  analytics: AnalyticsInterface[];
}

export const urlShortenerSchema = SchemaFactory.createForClass(UrlShortener);
urlShortenerSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
