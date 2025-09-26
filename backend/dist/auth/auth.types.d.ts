export type PublicUser = {
    id: number;
    email: string;
    name: string;
    role: 'user' | 'admin';
};
export type LoginResult = {
    accessToken: string;
    user?: PublicUser;
};
