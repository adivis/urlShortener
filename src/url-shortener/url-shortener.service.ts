import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UrlShortener } from './schemas/url-shortener.schema';
import { CreateUrlDto } from './dto/createUrl.dto';
import { User } from '../auth/schemas/users.schema';
import DeviceDetector = require('device-detector-js');
import { AnalyticsDto } from './dto/analytics.dto';

@Injectable()
export class UrlShortenerService {
  private readonly deviceDetector = new DeviceDetector();

  constructor(
    @InjectModel(UrlShortener.name)
    private readonly urlShortenerModel: Model<UrlShortener>,
  ) {}
  doAnalytics(headers: { 'user-agent': string }): {
    device;
    clientName;
  } {
    const userAgent = headers['user-agent'];
    const result = this.deviceDetector.parse(userAgent);
    return {
      device: result.device ? result.device : 'Browser',
      clientName: result.client ? result.client.name : 'NULL',
    };
  }
  async create(createUrlDto: CreateUrlDto, user: User) {
    const url = await this.urlShortenerModel.findOne({
      fullUrl: createUrlDto.fullUrl,
    });

    if (url) {
      const id = url.user;
      if (id.equals(user._id)) {
        return url;
      }
    }
    let t = new Date();
    t.setSeconds(t.getSeconds() + parseInt(process.env.EXPIRES_IN));

    const data = Object.assign(createUrlDto, {
      user: user._id,
      expireAt: t,
    });
    const newUrl = await this.urlShortenerModel.create(createUrlDto);
    return newUrl.save();
  }
  async getAnalytics(analyticsDto: AnalyticsDto, user: User) {
    const url = await this.urlShortenerModel.findOne(analyticsDto);

    if (url) {
      const id = url.user;
      if (!id.equals(user._id)) {
        throw new NotFoundException('Not such url present.');
      }
      return url.analytics;
    }
    throw new NotFoundException('Not such url present.');
  }

  async getUrl(
    shortUrl: string,
    user: User,
    headers: { 'user-agent': string },
  ) {
    const url = await this.urlShortenerModel.findOne({ shortUrl });
    if (url) {
      const id = url.user;
      if (!id.equals(user._id)) {
        throw new NotFoundException('Not such url present.');
      }
      const analytics = this.doAnalytics(headers);
      const urlDoc = await this.urlShortenerModel
        .findOneAndUpdate(
          {
            shortUrl,
          },
          {
            $set: { clicks: url.clicks + 1 },
            $push: { analytics },
          },
        )
        .exec();
      if (!urlDoc) throw new NotFoundException('No Short url exists.');
      return urlDoc.fullUrl;
    } else {
      throw new NotFoundException('Not such url present.');
    }
  }
}
