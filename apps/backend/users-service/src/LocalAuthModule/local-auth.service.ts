import { Inject, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserRepository } from '@geane/shared-persistence';
import * as argon2 from 'argon2';
import { CreateUserShape, LoginUserShape } from '@geane/shared-types';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';

@Injectable()
export class LocalAuthService {

    constructor(
        @Inject() private readonly userRepository: UserRepository
    ) {}

    async registerUser(registerDto: RegisterDto) {
        // Create user
        const registeringUser : CreateUserShape = {
            ...registerDto,
            passwordHash: await argon2.hash(registerDto.password),
        };
        const user = await this.userRepository.create(registeringUser);
        // TODO: Send email

        return user;
    }

    async loginUser(loginDto: LoginDto, response: Response) {
        // Find user by email
        const user = await this.userRepository.findIncludePasswordHash({ email: loginDto.email }) as LoginUserShape;
        if (!user) {
            throw new Error('User not found');
        }

        // Verify password
        const { passwordHash, ...userWithoutPassword } = user;
        const isPasswordValid = await argon2.verify(passwordHash, loginDto.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        // Create a session for the user, using cookies
        response.cookie('sessionId', user.userId, { // TODO: Generate a real session ID
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            sameSite: 'lax', // TODO: Adjust as necessary
        });

        // TODO: Return user data without password hash
        return userWithoutPassword;
    }
}
