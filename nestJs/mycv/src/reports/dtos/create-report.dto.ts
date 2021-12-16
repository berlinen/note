import { IsEmail, IsString, IsNumber, Min, Max, IsLatLong, IsLongitude } from 'class-validator'

export class CreateReportDto {
  @IsString()
  make: string

  @IsString()
  model: string

  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number

  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number

  @IsLongitude()
  lng: number

  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number

  @IsLatLong()
  lat: number
}