import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export default class UserDto {
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  _id!: string;

  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @IsNotEmpty()
  @IsString()
  email!: string;
}
