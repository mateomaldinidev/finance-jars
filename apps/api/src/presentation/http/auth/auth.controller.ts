import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() body: { username: string; password: string }) {
    return {
      message: 'Login local pendiente de implementación',
      username: body.username,
    };
  }
}
