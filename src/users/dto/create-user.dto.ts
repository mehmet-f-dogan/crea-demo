import { IsInt, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  username;

  @IsString()
  @MinLength(1)
  password;

  @IsPositive()
  @IsInt()
  age: number;
}
