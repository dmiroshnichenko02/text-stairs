import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString({
    message: 'Invalid refresh token',
  })
  refresh_token: string;
}
