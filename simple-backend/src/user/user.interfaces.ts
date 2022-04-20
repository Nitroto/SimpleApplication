import jwt from "jsonwebtoken";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    passwordDigest: string;
}

export interface UserToken extends jwt.JwtPayload {
    user: User;
}
