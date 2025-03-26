import { Controller, Post, Body, HttpException, HttpStatus, Get, Query } from '@nestjs/common';
import { ChargingService } from './charging.service';
import { ChargingStatusRequest } from './dto/charging-status-request.dto';
import { GetChargingStatusRequest } from "./dto/get-charging-status-request.dto";

@Controller('charging')
export class ChargingController {
    constructor(private readonly chargingService: ChargingService) { }

    @Post('update-status')
    async updateChargingStatus(@Body() chargingStatusRequest: ChargingStatusRequest) {
        try {
            const result = await this.chargingService.updateChargingStatus(chargingStatusRequest);
            return {
                message: 'Charging status updated successfully',
                status: result
            };
        } catch (error) {
            console.error(error);
            throw new HttpException(
                error.message || 'Failed to update charging status',
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Post('get-status')
    async getChargingStatuses(@Body() requestData: GetChargingStatusRequest) {
        try {
            const { userId, location, startDate, endDate } = requestData;

            if (!userId) {
                throw new HttpException('userId is required', HttpStatus.BAD_REQUEST);
            }

            if (location) {
                const statuses = await this.chargingService.getChargingStatusesByLocation({ location, userId, startDate, endDate });
                return {
                    message: 'Charging statuses by location retrieved successfully',
                    statuses
                };
            } else {
                const statuses = await this.chargingService.getChargingStatuses({ userId, startDate, endDate });
                return statuses;
            }
        } catch (error) {
            console.error(error);
            throw new HttpException(
                error.message || 'Failed to retrieve charging statuses',
                HttpStatus.BAD_REQUEST
            );
        }
    }
}
