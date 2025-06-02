export type TSession  = {
    isAuth: boolean;
    user: SessionUser | null
    user_type: 'b2b' | 'guest'
}

export type SessionUser = {
    userId: string;
    roleBaseUserId: string;
    userUniqueId: string;
    email: string;
}