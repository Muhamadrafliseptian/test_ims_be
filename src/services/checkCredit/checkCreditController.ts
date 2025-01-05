import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { checkCreditServices } from './checkCreditServices';
@Controller('credit')
export class checkCreditController {
  constructor(private readonly appService: checkCreditServices) { }

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

    const data = this.appService.calculateMonthlyPayment(
      price,
      downPaymentPercentage,
      months
    );

    return { data };
  }
}
