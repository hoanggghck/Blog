import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { MyLogger } from "src/logger/my.log";

@Controller('auth')
export class AuthController {
    private myLogger = new MyLogger();
    constructor(private authService: AuthService) {}

    @Post('login')
    login() {
        this.authService.login();
    }
    @Post('register')
    register() {
        // this.authService.register();
        this.myLogger.warn('Handling GET request for /', AuthController.name);
        return {
            message: "register"
        }
    }
}
