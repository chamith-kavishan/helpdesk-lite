import { UsersService } from '../users/users.service';
import { LoginResult } from './auth.types';
export declare class AuthService {
    private users;
    constructor(users: UsersService);
    register(name: string, email: string, password: string, role?: 'user' | 'admin'): Promise<{
        id: number;
        email: string;
        role: "user" | "admin";
    }>;
    login(email: string, password: string): Promise<LoginResult>;
}
