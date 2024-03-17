import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUrlDto } from './dto/createUrl.dto';
import { AnalyticsDto } from './dto/analytics.dto';
@Controller('url-shortener')
export class UrlShortenerController {
  constructor(private urlShortenerService: UrlShortenerService) {}
  @Post()
  @UseGuards(AuthGuard())
  create(@Body(ValidationPipe) createUrlDto: CreateUrlDto, @Req() req) {
    return this.urlShortenerService.create(createUrlDto, req.user);
  }
  @Get('analytics')
  @UseGuards(AuthGuard())
  getAnalytics(@Body(ValidationPipe) analyticsDto: AnalyticsDto, @Req() req) {
    return this.urlShortenerService.getAnalytics(analyticsDto, req.user);
  }
  @Get(':shortUrl')
  @UseGuards(AuthGuard())
  getUrl(@Param('shortUrl') shortUrl: string, @Req() req) {
    return this.urlShortenerService.getUrl(shortUrl, req.user, req.headers);
  }
}
