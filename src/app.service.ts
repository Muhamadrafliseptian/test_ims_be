import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Endah Marganing Kusumawati sayang endah';
  }

  calculateMonthlyPayment(price: number, downPaymentPercentage: number, months: number): string {
    const downPayment = (downPaymentPercentage / 100) * price;
    
    const loanAmount = price - downPayment;
    
    let interestRate = 0;

    if (months < 12) {
      interestRate = 0.12;
    } else if (months >= 12 && months <= 24) {
      interestRate = 0.14;
    } else {
      interestRate = 0.165;
    }

    const totalLoanWithInterest = loanAmount + (loanAmount * interestRate);
    const monthlyPayment = totalLoanWithInterest / months;

    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });

    return formatter.format(monthlyPayment); 
  }
}
