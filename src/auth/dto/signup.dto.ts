import { IsInt, IsPositive, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  @MinLength(1)
  username: string;

  @IsString()
  @MinLength(1)
  password: string;

  @IsPositive()
  @IsInt()
  age: number;
}
