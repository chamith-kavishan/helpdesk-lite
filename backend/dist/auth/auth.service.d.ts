import { UsersService } from '../users/users.service';
export declare class AuthService {
    private users;
    constructor(users: UsersService);
    register(email: string, password: string, role?: 'user' | 'admin'): Promise<{
        id: any;
        email: string;
        role: "user" | "admin";
    }>;
    login(email: string, password: string): Promise<{
        accessToken: any;
    }>;
}
