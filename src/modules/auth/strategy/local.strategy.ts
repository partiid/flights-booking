import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }
    async validate(username: string, password: string): Promise<any> {
        console.log("Username: ", username)
        const employee = await this.authService.validateEmployee(username, password);
        if (!employee) {
            throw new UnauthorizedException();
        }
        return employee;
    }

}