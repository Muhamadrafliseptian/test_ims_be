import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModuleSer } from './config/configModule';
import { checkCreditModule } from './services/checkCredit/checkCreditModule';
import { TemporDataCreditEntity } from './services/checkQuery/tempoDataCredit';
import { ClientDataEntity } from './services/checkQuery/clientData';
import { checkQueryModule } from './services/checkQuery/checkQueryModule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModuleSer],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'db_ims_test',
        entities: [TemporDataCreditEntity, ClientDataEntity],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    checkQueryModule,
    checkCreditModule
  ],
  providers: [],
})
export class AppModule { }