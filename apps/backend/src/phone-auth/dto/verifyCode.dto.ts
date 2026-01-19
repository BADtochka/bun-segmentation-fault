import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { PreCodeDto } from './preCode.dto';

export class VerifyCodeDto extends PreCodeDto {
  constructor() {
    super();
  }

  @IsString()
  @MinLength(4, { message: 'Код должен состоять из 4 цифр' })
  @MaxLength(4, { message: 'Код должен состоять из 4 цифр' })
  code: string;

  @IsNotEmpty({
    message: 'Вы не ввели имя',
  })
  @Matches(/[А-Яа-я]/, { message: 'Имя должно состоять только из русских букв' })
  firstName: string;

  @IsNotEmpty({
    message: 'Вы не ввели фамилию',
  })
  @Matches(/[А-Яа-я]/, { message: 'Фамилия должна состоять только из русских букв' })
  lastName: string;
}
