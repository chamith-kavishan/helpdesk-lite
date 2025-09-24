export declare class UsersService {
    create(email: string, password_hash: string, role?: 'user' | 'admin'): Promise<{
        id: any;
        email: string;
        role: "user" | "admin";
    }>;
    findByEmail(email: string): Promise<any>;
    findById(id: number): Promise<any>;
}
