import { RowDataPacket } from 'mysql2';
interface UserRow extends RowDataPacket {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    role: 'user' | 'admin';
    created_at: Date;
}
export declare class UsersService {
    create(name: string, email: string, password_hash: string, role?: 'user' | 'admin'): Promise<{
        id: number;
        email: string;
        role: 'user' | 'admin';
    }>;
    findByEmail(email: string): Promise<UserRow>;
    findById(id: number): Promise<UserRow>;
    listUsers(): Promise<import("mysql2").QueryResult>;
}
export {};
