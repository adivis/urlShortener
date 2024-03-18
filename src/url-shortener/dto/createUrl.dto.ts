import { IsEmpty, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { User } from '../../auth/schemas/users.schema';
import { AnalyticsInterface } from '../interfaces/analytics.interface';

export class CreateUrlDto {
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  fullUrl: string;

  @IsEmpty()
  user?: User;

  @IsEmpty()
  analytics?: AnalyticsInterface;
}
