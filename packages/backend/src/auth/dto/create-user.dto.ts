import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({
    message: 'Вы не ввели имя',
  })
  @IsString()
  name: string;

  @IsNotEmpty({
    message: 'Вы не ввели пароль',
  })
  @IsString()
  password: string;
}
