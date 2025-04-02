import { Injectable } from '@nestjs/common';
import { DbService } from "src/shared/db/db.service";
import { ChargingStatus } from "src/user/lib/db/instadb.client";

@Injectable()
export class ChargingService {
      constructor(
        private readonly dbService: DbService
      ) {}
    
    async updateChargingStatus({ userId, isPluggedIn, userLocation, manualLocation }: { userId: string, isPluggedIn: boolean, userLocation: string, manualLocation: boolean }) {
        return await this.dbService.addChargingStatus({
            id: '',
            userId,
            isPluggedIn,
            userLocation,
            manualLocation,
            statusTime: Date.now()
        } as ChargingStatus);
    }

    async getChargingStatuses({ userId, startDate, endDate }: { userId: string, startDate?: number, endDate?: number }): Promise<ChargingStatus[]> {
        // Default to last 7 days if no date range is provided
        const end = endDate || Date.now();
        const start = startDate || (end - 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds

        return await this.dbService.getChargingStatusesByDateRange({ userId, startDate: start, endDate: end });
    }

    async getChargingStatusesByLocation({ location, userId, startDate, endDate }: { location: string, userId: string, startDate?: number, endDate?: number }): Promise<ChargingStatus[]> {
        // Default to last 7 days if no date range is provided
        const end = endDate || Date.now();
        const start = startDate || (end - 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds

        return await this.dbService.getChargingStatusesByLocation({ location, startDate: start, endDate: end, userId });
    }
}
