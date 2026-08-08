import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterInput } from './dto/register.dto';
import { User } from 'src/users/schema/user.schema';
import { LoginDto } from './dto/login.dto';
import { comparePassword } from 'src/utils/password.util';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { QueryFilter, Model } from 'mongoose';


export interface TokenPayload {
    userId: string,
    email: string,
}

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) { }
    async registerUser(registerInput: RegisterInput) {
        const { email, password, name } = registerInput;
        const user = await this.userModel.create({ name, email, password });
        return user;
    }

    private async checkExistUser(where: QueryFilter<User>): Promise<User | null> {
        const query = this.userModel.findOne(where);
        return query;
    }

    async generateTokens(tokenPayload: TokenPayload): Promise<{ accessToken: string, refreshToken: string }> {
        const accessTime = this.configService.get<number>('ACCESS_TOKEN');
        const accessSecret = this.configService.get<string>('JWT_SECRET_KEY')
        const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET_KEY')
        const refreshTime = this.configService.get<number>('REFRESH_TOKEN');
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(tokenPayload, {
                secret: accessSecret,
                expiresIn: accessTime
            }),
            this.jwtService.signAsync(tokenPayload, {
                secret: refreshSecret,
                expiresIn: refreshTime
            })
        ]);
        return { accessToken, refreshToken }
    }

    private toPublicUser(user: User) {
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            avatarUrl: user.profile ?? null,
        };
    }


    async login(loginInput: LoginDto) {
        const { email, password } = loginInput;

        const user = await this.checkExistUser({ email });
        if (!user) {
            throw new UnauthorizedException('Invalid email or password.');
        }

        const checkPassword = await comparePassword(password, user?.password);
        if (!checkPassword) {
            throw new UnauthorizedException('Invalid email or password.');
        }

        const tokens = await this.generateTokens({ userId: user?._id, email: user?.email });

        return {
            ...tokens,
            user: this.toPublicUser(user as unknown as User),
        }

    }


}
