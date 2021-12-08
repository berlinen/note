import { Module } from '@nestjs/common';
import { PowerService } from './power.service';

@Module({
  exports: [PowerService],
  providers: [PowerService],
})
export class PowerModule {}
