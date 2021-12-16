import { Controller, Post, Body} from '@nestjs/common';
import { CreateReportDto } from './report.entity'

@Controller('reports')
export class ReportsController {
  @Post()
  createReport(@Body() body: CreateReportDto) {

  }
}
