import { Request, Response, NextFunction } from "express"
import { AuthService } from "./auth.service"
import { registerSchema, loginSchema } from "./auth.validation"
import { setRefreshTokenCookie, } from "../../utils/cookies"

export class AuthController {
    // register User
    static async register(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = registerSchema.parse(req.body);
            const user = await AuthService.register(
                {
                    email:data.email,
                password : data.password,
                }
            );
            return res.status(201).json({
                success: true,
                message: "User registerd Successfully",
                data: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (err) {
            next(err)
        }
    }

    // login User
    static async login(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = loginSchema.parse(req.body);
            const result = await AuthService.login({
                email:data.email,
                password : data.password,
            });
            setRefreshTokenCookie(res, result.refreshToken);
            return res.status(200).json({success: true,accessToken: result.accessToken,user: { id: result.user.id, email: result.user.email, role: result.user.role }})
        } catch (err) {
            next(err)
        }
    }
}