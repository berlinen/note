import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { User } from '../users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report> ) {}

  createEstimate({ make, model, lng, lat, year, mileage }) {
    return this.repo.createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameter("mileage", mileage)
      .limit(3)
      .getRawMany()
  }

  create(reportDto: CreateReportDto, user: User) {
    // @ts-ignore
    const report = this.repo.create(reportDto)
    report.user = user

    return this.repo.save(report)
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne(id)

    if(!report) {
      throw new NotFoundException('report not found')
    }

    report.approved = approved

    return this.repo.save(report)
  }
}
