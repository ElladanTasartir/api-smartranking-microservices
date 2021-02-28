import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import AWS from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import { Environment } from 'src/common/enums/env.enum';

@Injectable()
export class AwsService {
  private logger = new Logger(AwsService.name);

  constructor(private configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File, id: string) {
    const region = this.configService.get<string>(Environment.AWS_REGION);
    const accessKeyId = this.configService.get<string>(Environment.AWS_ACCESS_KEY_ID);
    const secretAccessKey = this.configService.get<string>(
      Environment.AWS_SECRET_ACCESS_KEY,
    );
    const bucketName = this.configService.get<string>(Environment.AWS_S3_BUCKET_NAME);

    const s3 = new AWS.S3({
      region,
      accessKeyId,
      secretAccessKey,
    });

    const [, fileExtension] = file.originalname.split('.');

    const urlKey = `${id}.${fileExtension}`;

    const params: PutObjectRequest = {
      Body: file.buffer,
      Bucket: bucketName,
      Key: urlKey,
    };

    try {
      await s3.putObject(params).promise();

      return {
        url: `https://${params.Bucket}.s3-sa-east-1.amazonaws.com/${urlKey}`,
      };
    } catch (err) {
      this.logger.error(err);

      return err;
    }
  }
}
