import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<{
        id: any;
        email: string;
        role: "user" | "admin";
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: any;
    }>;
}
