import { Injectable } from '@nestjs/common';
import {
    addChargingStatus, ChargingStatus,
    createUser,
    getUserByEmailOrPhone,
    getUserById,
    getChargingStatusesByDateRange,
    getChargingStatusesByLocation,
    User
} from "src/user/lib/db/instadb.client";

@Injectable()
export class DbService {
    // User related methods
    async createUser(user: User): Promise<User> {
        return await createUser(user);
    }

    async getUserByEmailOrPhone(emailOrPhone: string): Promise<User | null> {
        return await getUserByEmailOrPhone(emailOrPhone);
    }

    async getUserById(id: string): Promise<User | null> {
        return await getUserById(id);
    }

    // Charging status related methods
    async addChargingStatus(chargingStatus: ChargingStatus): Promise<ChargingStatus> {
        return await addChargingStatus(chargingStatus);
    }

    async getChargingStatusesByDateRange({ userId, startDate, endDate }: { userId: string, startDate: number, endDate: number }): Promise<ChargingStatus[]> {
        return await getChargingStatusesByDateRange({ userId, startDate, endDate });
    }

    async getChargingStatusesByLocation({ location, startDate, endDate, userId }: { location: string, startDate: number, endDate: number, userId: string }): Promise<ChargingStatus[]> {
        return await getChargingStatusesByLocation({ location, startDate, endDate, userId });
    }
}
