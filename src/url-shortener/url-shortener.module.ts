import { Module } from '@nestjs/common';
import { UrlShortenerController } from './url-shortener.controller';
import { UrlShortenerService } from './url-shortener.service';
import { MongooseModule } from '@nestjs/mongoose';
import { urlShortenerSchema } from './schemas/url-shortener.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'UrlShortener',
        schema: urlShortenerSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [UrlShortenerController],
  providers: [UrlShortenerService],
})
export class UrlShortenerModule {}
