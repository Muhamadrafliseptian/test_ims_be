import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { TemporDataCreditEntity } from "./tempoDataCredit";

@Entity({ name: 'tab_client_data' })
export class ClientDataEntity {
  @PrimaryGeneratedColumn('uuid')
  id_client: string;

  @Column({ nullable: true })
  CLIENT_NAME: string;

  @Column({ nullable: true })
  OTR: string;

  @Column({ nullable: true })
  KONTRAK_NO: string;

  @OneToMany(() => TemporDataCreditEntity, tempoData => tempoData.client) 
  tempoDataCredits: TemporDataCreditEntity[];
}
