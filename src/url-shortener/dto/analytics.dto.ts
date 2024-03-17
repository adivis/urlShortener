import { IsNotEmpty, IsString } from 'class-validator';

export class AnalyticsDto {
  @IsNotEmpty()
  @IsString()
  shortUrl: string;
}
