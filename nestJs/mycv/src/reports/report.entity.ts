import { Column, PrimaryGeneratedColumn, Entity, ManyToOne } from 'typeorm'
import { User } from '../users/user.entity'

@Entity()
export class Report {
 @PrimaryGeneratedColumn()
 id: number

 @Column({ default: false })
 approved: boolean

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

 @ManyToOne(() => User, (user) => user.reports)
 user: User
}