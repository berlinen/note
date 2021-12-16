import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm'

@Entity()
export class Report {
 @PrimaryGeneratedColumn()
 id: number

 @Column()
 price: number

 @Column()
 model: string

 @Column()
 make: string

 @Column()
 year: string

 @Column()
 lng: number

 @Column()
 lat: number

 @Column()
 mileage: string
}