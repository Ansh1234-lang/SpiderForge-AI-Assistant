import { prisma } from "../../lib/prisma";
import { hashPassword, comparePassword } from "../../utils/hash";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../../utils/jwt";

import {
    RegisterDto,
    LoginDto,
} from "./auth.types";

export class AuthService {
    static async register(data: RegisterDto) {
        const existingUser =
            await prisma.user.findUnique({
                where: {
                    email: data.email,
                },
            });

        if (existingUser) {
            throw new Error(
                "User already exists"
            );
        }

        const hashedPassword =
            await hashPassword(data.password);

        const user =
            await prisma.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                },
            });

        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: "USER_REGISTERED",
                entityType: "USER",
                entityId: user.id,
            },
        });

        return user;
    }

    static async login(data: LoginDto) {
        const user =
            await prisma.user.findUnique({
                where: {
                    email: data.email,
                },
            });

        if (!user) {
            throw new Error(
                "Invalid credentials"
            );
        }

        const isValidPassword =
            await comparePassword(
                data.password,
                user.password
            );

        if (!isValidPassword) {
            throw new Error(
                "Invalid credentials"
            );
        }

        const accessToken =
            generateAccessToken({
                userId: user.id,
                role: user.role,
            });

        const refreshToken =
            generateRefreshToken({
                userId: user.id,
                role: user.role,
            });

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(
                    Date.now() +
                    30 *
                    24 *
                    60 *
                    60 *
                    1000
                ),
            },
        });

        return {
            user,
            accessToken,
            refreshToken,
        };
    }
}