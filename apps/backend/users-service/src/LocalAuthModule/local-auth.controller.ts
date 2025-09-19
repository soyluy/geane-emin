import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthService } from './local-auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';

@Controller('auth/local')
export class LocalAuthController {
    // Define your local authentication endpoints here
    // For example, login, register, logout, etc.
    // Each method can be decorated with @Get(), @Post(), etc. to handle different HTTP methods
    // and can use services to handle business logic.

    constructor(
        private readonly localAuthService: LocalAuthService
    ) {}

    // Register endpoint for local authentication
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'User successfully registered',
    })
    @ApiBody({ type: RegisterDto })
    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async register(
        @Body() registerDto: RegisterDto
    ) {
        return this.localAuthService.registerUser(registerDto);
    }

    // Login endpoint for local authentication
    @ApiOperation({ summary: 'Login a user' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User successfully logged in',
    })
    @ApiBody({ type: LoginDto })
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) response: Response
    ) {
        return this.localAuthService.loginUser(loginDto, response);
    }

    // Logout endpoint for local authentication
    @Post('logout')
    async logout() {
        // TODO
        // Logout logic here
        // Just clear the session from redis
    }

    @Post('forgot-password')
    async forgotPassword() {
        // TODO
        // Logic to handle forgot password functionality
        // Sends email with reset link or code
    }

    @Post('reset-password')
    async resetPassword() {
        // TODO
        // Logic to handle password reset
        // Validates the reset token and updates the user's password
    }

    @Post('change-password')
    async changePassword() {
        // TODO
        // Logic to change the user's password
        // Requires current password and new password
        // Requires authentication
    }
    
}
