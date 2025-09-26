import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<{
        id: number;
        email: string;
        role: "user" | "admin";
    }>;
    login(dto: LoginDto): Promise<import("./auth.types").LoginResult>;
}
