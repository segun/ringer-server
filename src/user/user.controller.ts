import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterRequest } from "./dto/register-request.dto";
import { LoginRequest } from "./dto/login-request.dto";
import { ChargingStatusRequest } from "./dto/charging-status-request.dto";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('register')
    async register(@Body() registerRequest: RegisterRequest) {
        const { emailOrPhone, passcode, location, manualLocation } = registerRequest;
        const existingUser = await this.userService.findUserByEmailOrPhone(emailOrPhone);
        if (existingUser) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
        const user = await this.userService.register(emailOrPhone, passcode, location, manualLocation);
        return { message: 'Registration successful', user };
    }

    @Post('login')
    async login(@Body() loginRequest: LoginRequest) {
        const { emailOrPhone, passcode } = loginRequest;
        const user = await this.userService.login(emailOrPhone, passcode);
        if (!user) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
        return { message: 'Login successful', user };
    }

    @Post('charging-status')
    async updateChargingStatus(@Body() chargingStatusRequest: ChargingStatusRequest) {
        const { userId, isPluggedIn, userLocation, manualLocation } = chargingStatusRequest;
        
        try {
            const result = await this.userService.updateChargingStatus(
                userId, 
                isPluggedIn, 
                userLocation, 
                manualLocation
            );
            return { 
                message: 'Charging status updated successfully', 
                status: result 
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to update charging status', 
                HttpStatus.BAD_REQUEST
            );
        }
    }
}
