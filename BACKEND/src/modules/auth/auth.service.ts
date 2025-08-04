import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
    login() {
        return {
            message: "login"
        }
    }

    register() {
        return {
            message: "register"
        }
    }
}

const service = new AuthService();