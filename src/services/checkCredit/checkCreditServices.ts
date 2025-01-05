import { Injectable } from '@nestjs/common';

@Injectable()
export class checkCreditServices {
  calculateMonthlyPayment(price: number, downPaymentPercentage: number, months: number): any {
    // Menghitung Down Payment
    const downPayment = (downPaymentPercentage / 100) * price;

    // Menghitung jumlah pinjaman setelah down payment
    const loanAmount = price - downPayment;

    // Menentukan suku bunga berdasarkan jumlah bulan
    let interestRate = 0;

    if (months < 12) {
      interestRate = 0.12;
    } else if (months >= 12 && months <= 24) {
      interestRate = 0.14;
    } else {
      interestRate = 0.165;
    }

    // Menghitung total pinjaman dengan bunga
    const totalLoanWithInterest = loanAmount + (loanAmount * interestRate);
    const monthlyPayment = totalLoanWithInterest / months;

    // Membuat formatter untuk IDR
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });

    // Memformat Down Payment dan Monthly Payment ke IDR
    const formattedDownPayment = formatter.format(downPayment);
    const formattedMonthlyPayment = formatter.format(monthlyPayment);

    return {
      downPayment: formattedDownPayment,
      monthlyPayment: formattedMonthlyPayment,
    };
  }
}
