import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    this.logger.log(`Login attempt for email: ${loginDto.email}`);

    // In a real implementation, you would validate against Keycloak here
    // For this demo, we'll do a simple email/password check
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user || !user.isActive) {
      this.logger.warn(`Login failed for email: ${loginDto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: user.email,
      sub: user.keycloakId || user.id,
      role: user.role,
    };

    this.logger.log(`Login successful for user: ${user.email}`);

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async validateUser(keycloakId: string) {
    return this.usersService.findByKeycloakId(keycloakId);
  }
}
