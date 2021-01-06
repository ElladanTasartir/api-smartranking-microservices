import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { LocalService } from './local.service';

@Module({
  providers: [AwsService, LocalService],
  exports: [AwsService, LocalService],
})
export class UploadsModule {}
