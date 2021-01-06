import { Injectable, Logger } from '@nestjs/common';
import AWS from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';

@Injectable()
export class AwsService {
  private logger = new Logger(AwsService.name);

  async uploadFile(file: Express.Multer.File, id: string) {
    const s3 = new AWS.S3({
      region: 'sa-east-1',
      accessKeyId: 'MOCK-ACCESS-KEY',
      secretAccessKey: 'MOCK-SECRET-ACCESS-KEY',
    });

    const [, fileExtension] = file.originalname.split('.');

    const urlKey = `${id}.${fileExtension}`;

    const params: PutObjectRequest = {
      Body: file.buffer,
      Bucket: 'smartranking',
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
