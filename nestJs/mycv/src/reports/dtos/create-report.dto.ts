import { IsEmail, IsString, IsNumber, Min, Max } from 'class-validator'

export class CreateReportDto {
  @IsString()
  make: string

  @IsString()
  model: string

  @IsNumber()
  year: number

  @IsNumber()
  mileage: number

  @IsNumber()
  lng: number

  @IsNumber()
  price: number

  @IsNumber()
  lat: number
}