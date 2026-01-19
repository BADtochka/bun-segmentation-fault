import { IsString, MaxLength, MinLength } from 'class-validator';

export class PreCodeDto {
  @IsString({
    message: 'Вы не указали номер телефона',
  })
  @MaxLength(10, {
    message: 'Номер телефона должен содержать 10 цифр (без +7)',
  })
  @MinLength(10, {
    message: 'Номер телефона должен содержать 10 цифр (без +7)',
  })
  phoneNumber: string;
}
