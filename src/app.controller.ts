import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('calculate')
  calculateCredit(
    @Body() body: { price: number; downPaymentPercentage: number; months: number }
  ) {
    const { price, downPaymentPercentage, months } = body;

    if (
      isNaN(price) || 
      isNaN(downPaymentPercentage) || 
      isNaN(months) || 
      months <= 0
    ) {
      return { error: 'Invalid input values. Please make sure the input is correct.' };
    }

    const monthlyPayment = this.appService.calculateMonthlyPayment(
      price,
      downPaymentPercentage,
      months
    );

    return { monthlyPayment };
  }
}
