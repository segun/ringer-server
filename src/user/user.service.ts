import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { DbService } from '../shared/db/db.service';
import { User } from "./lib/db/instadb.client";

@Injectable()
export class UserService {
  constructor(
    private readonly dbService: DbService
  ) {}

  async register({ emailOrPhone, passcode, location, manualLocation }: { emailOrPhone: string, passcode: string, location: string, manualLocation: boolean }): Promise<User> {
    const hashedPasscode = this.hashPasscode(passcode);
    const user = {
      id: '',
      emailOrPhone,
      passcode: hashedPasscode,
      location,
      manualLocation,
    }

    return await this.dbService.createUser(user);
  }

  async login(emailOrPhone: string, passcode: string): Promise<User | null> {
    const user = await this.dbService.getUserByEmailOrPhone(emailOrPhone);

    if (user && this.comparePasscodes(passcode, user.passcode)) {
      return user;
    }
    return null;
  }

  async getUserByEmailOrPhone(emailOrPhone: string): Promise<User | null> {
    return await this.dbService.getUserByEmailOrPhone(emailOrPhone);
  }

  private hashPasscode(passcode: string): string {
    return crypto.createHash('sha256').update(passcode).digest('hex');
  }

  private comparePasscodes(plainPasscode: string, hashedPasscode: string): boolean {
    const hashedInput = this.hashPasscode(plainPasscode);
    return hashedInput === hashedPasscode;
  }  
}
