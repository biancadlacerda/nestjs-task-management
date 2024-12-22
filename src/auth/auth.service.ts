import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UsersRepository) 
        private readonly usersRepository: UsersRepository,
        private jwtService: JwtService,
    ) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.usersRepository.CreateUser(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string}> {
        const{ username, password } = authCredentialsDto;
        const user = await this.usersRepository.findOne({ where: { username } });

        if (user && await bcrypt.compare(password, user.password)) {
            const payload: JwtPayload = { username };
            const accessToken = await this.jwtService.sign(payload);
            return {accessToken};
        } else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }
}
