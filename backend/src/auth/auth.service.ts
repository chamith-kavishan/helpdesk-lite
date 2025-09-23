import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private users: UsersService) {}

  async register(
    email: string,
    password: string,
    role: 'user' | 'admin' = 'user',
  ) {
    const exists = await this.users.findByEmail(email);
    if (exists) throw new UnauthorizedException('Email already in use');
    const hash = await bcrypt.hash(password, 12);
    return this.users.create(email, hash, role);
  }

  async login(email: string, password: string) {
    const u = await this.users.findByEmail(email);
    if (!u) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, u.password_hash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const token = jwt.sign(
      { sub: u.id, email: u.email, role: u.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES || '1d' },
    );

    return { accessToken: token };
  }
}
