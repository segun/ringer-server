import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ChargingModule } from './charging/charging.module';
import { SharedModule } from './shared/shared.module';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally
    }),
    SharedModule,
    UserModule,
    ChargingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
