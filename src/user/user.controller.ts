import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterRequest } from "./dto/register-request.dto";
import { LoginRequest } from "./dto/login-request.dto";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async register(@Body() registerRequest: RegisterRequest) {
        const { emailOrPhone, passcode, location, manualLocation } = registerRequest;
        const existingUser = await this.userService.findUserByEmailOrPhone(emailOrPhone);
        if (existingUser) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
        const user = await this.userService.register({ emailOrPhone, passcode, location, manualLocation });
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
}
