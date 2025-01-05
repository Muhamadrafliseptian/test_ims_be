import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ClientDataEntity } from "./clientData";
@Entity({ name: 'tab_tempo_data_credit' })
export class TemporDataCreditEntity {
  @PrimaryGeneratedColumn()
  id_kontrak: string;

  @Column({ nullable: true })
  KONTRAK_NO: string;

  @Column({ nullable: true })
  ANGSURAN_KE: string;

  @Column({ nullable: true })
  ANGSURAN_PER_BULAN: string;

  @Column({ nullable: true })
  TANGGAL_JATUH_TEMPO: string;

  @ManyToOne(() => ClientDataEntity, client => client.tempoDataCredits)
  client: ClientDataEntity;
}
