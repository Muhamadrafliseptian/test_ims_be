import { Module } from '@nestjs/common';
import { CheckQueryServices } from './checkQueryServices';
import { checkQueryController } from './checkQueryController';
import { ClientDataEntity } from './clientData';
import { TemporDataCreditEntity } from './tempoDataCredit';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [TypeOrmModule.forFeature([ClientDataEntity, TemporDataCreditEntity]), ConfigModule.forRoot()],
    controllers: [checkQueryController],
    providers: [CheckQueryServices],
})
export class checkQueryModule { }
