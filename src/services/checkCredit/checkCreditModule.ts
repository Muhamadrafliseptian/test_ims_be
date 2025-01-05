import { Module } from '@nestjs/common';
import { checkCreditController } from './checkCreditController';
import { checkCreditServices } from './checkCreditServices';

@Module({
  imports: [],
  controllers: [checkCreditController],
  providers: [checkCreditServices],
})
export class checkCreditModule {}
