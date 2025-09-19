import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {

    @Get('me')
    async getMe() {
        // Logic to get the current authenticated user
        // This could return user details based on the authentication token
    }

    @Get('verify-email')
    async verifyEmail() {
        // Logic to verify the user's email
        // Could be triggered by a verification link sent to the user's email
        // This could also be used to resend the verification email, if it does not have a token in the query parameters
    }

    @Get('verify-phone')
    async verifyPhone(){
        // Verify phone number here.
    }
}
