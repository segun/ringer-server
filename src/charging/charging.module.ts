import { Module } from '@nestjs/common';
import { ChargingController } from "./charging.controller";
import { ChargingService } from "./charging.service";

@Module({
  controllers: [ChargingController],
  providers: [ChargingService],
  exports: [ChargingService]
})
export class ChargingModule {}
