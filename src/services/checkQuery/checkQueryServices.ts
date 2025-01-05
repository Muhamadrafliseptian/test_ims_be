import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TemporDataCreditEntity } from "./tempoDataCredit";

@Injectable()
export class CheckQueryServices {
    constructor(
        @InjectRepository(TemporDataCreditEntity)
        private readonly tempoDataRepository: Repository<TemporDataCreditEntity>
    ) { }

    async getTotalAngsuranJatuhTempo() {
        try {
            // Menetapkan tanggal batas untuk filter data
            const tanggalBatas = '2024-08-14';

            // Membuat query menggunakan QueryBuilder untuk mengambil data angsuran
            const result = await this.tempoDataRepository
                .createQueryBuilder('tempo') // Membuat query builder untuk tabel 'tempo' dengan alias 'tempo'
                .innerJoinAndSelect('tempo.client', 'client') // Melakukan INNER JOIN antara tabel 'tempo' dan 'client', dengan alias 'client'
                .where('client.CLIENT_NAME = :clientName', { clientName: 'Sugus' }) // Filter data berdasarkan nama klien yang bernama 'Sugus'
                .andWhere('tempo.TANGGAL_JATUH_TEMPO <= :tanggalBatas', { tanggalBatas }) // Filter data berdasarkan tanggal jatuh tempo <= tanggal batas yang sudah ditentukan
                .select([ // Memilih kolom yang akan diambil dalam query
                    'client.KONTRAK_NO', // Nomor kontrak klien
                    'client.CLIENT_NAME', // Nama klien
                    'SUM(CAST(tempo.ANGSURAN_PER_BULAN AS DECIMAL)) AS totalAngsuran', // Menghitung total angsuran (jumlah angsuran per bulan) dengan tipe data DECIMAL
                ])
                .groupBy('client.KONTRAK_NO') // Mengelompokkan hasil query berdasarkan nomor kontrak klien
                .getRawMany(); // Mendapatkan hasil query dalam bentuk array raw data (bukan entity)
            const data = result.map(item => ({
                KONTRAK_NO: item.client_KONTRAK_NO, // Mengambil nomor kontrak dari hasil query
                CLIENT_NAME: item.client_CLIENT_NAME, // Mengambil nama klien dari hasil query
                TOTAL_ANGSURAN_JATUH_TEMPO: this.formatIDR(item.totalAngsuran) // Memformat total angsuran menjadi format IDR
            }));

            // Mapping hasil query menjadi format yang lebih mudah dibaca
            return { data, statusCode: HttpStatus.OK }

        } catch (error) {
            // Menangani error jika terjadi masalah pada query atau bagian lain
            throw error;
        }
    }


    async calculateDenda() {
        try {
          const tanggalBatas = '2024-08-14';  // Tanggal batas untuk menghitung denda
    
          // Query untuk mendapatkan semua data angsuran yang sudah jatuh tempo
          const result = await this.tempoDataRepository
            .createQueryBuilder('tempo')
            .innerJoinAndSelect('tempo.client', 'client')  // Menggabungkan dengan tabel client
            .where('client.CLIENT_NAME = :clientName', { clientName: 'Sugus' })  // Memfilter klien berdasarkan nama 'Sugus'
            .andWhere('tempo.TANGGAL_JATUH_TEMPO <= :tanggalBatas', { tanggalBatas })  // Mengambil angsuran dengan tanggal 
            //jatuh tempo sebelum atau pada tanggal 14 Agustus 2024
            .andWhere('tempo.ANGSURAN_KE >= :angsuranKe', { angsuranKe: 5 })  // Hanya mengambil angsuran ke-5 dan seterusnya
            .select([
              'client.KONTRAK_NO',           // Nomor kontrak
              'client.CLIENT_NAME',           // Nama klien
              'tempo.ANGSURAN_KE',            // Angsuran keberapa
              'tempo.ANGSURAN_PER_BULAN',     // Jumlah angsuran per bulan
              'tempo.TANGGAL_JATUH_TEMPO',   // Tanggal jatuh tempo
            ])
            .getMany();  // Mengambil hasil query dalam bentuk array objek
    
          let totalDenda = 0;  // Total denda yang dihitung
          let angsuranBelumDibayar = 0;  // Total denda yang dihitung
          const dendaPerAngsuran: any[] = [];  //  Menyimpan detail denda per angsuran
    
          // Perulangan setiap item dalam result untuk menghitung denda
          result.forEach((item) => {
            const tanggalJatuhTempo = new Date(item.TANGGAL_JATUH_TEMPO);  // Konversi tanggal jatuh tempo ke objek Date
            const tanggalBatas = new Date('2024-08-14');  // Tanggal batas (14 Agustus 2024)
            
            // Menghitung selisih waktu antara tanggal batas dan tanggal jatuh tempo
            const diffTime = Math.abs(tanggalBatas.getTime() - tanggalJatuhTempo.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));  // Menghitung selisih hari
          
            // Jika ada keterlambatan (diffDays > 0), hitung denda
            if (diffDays > 0) {
              const angsuranPerBulan = parseFloat(item.ANGSURAN_PER_BULAN);  // Konversi angsuran per bulan
              const dendaPerHari = angsuranPerBulan * 0.001;  // Denda per hari adalah 0,1% dari angsuran per bulan
              const totalDendaAngsuran = dendaPerHari * diffDays;  // Menghitung total denda berdasarkan jumlah hari keterlambatan
          
              totalDenda += totalDendaAngsuran;  // Menambahkan total denda angsuran ke total denda keseluruhan
          
              // Menyimpan data denda per angsuran untuk respons
              dendaPerAngsuran.push({
                KONTRAK_NO: item.client.KONTRAK_NO,                  // Nomor kontrak
                CLIENT_NAME: item.client.CLIENT_NAME,         // Nama klien
                ANGSURAN_KE: item.ANGSURAN_KE,                // Angsuran keberapa
                TANGGAL_JATUH_TEMPO: item.TANGGAL_JATUH_TEMPO, // Tanggal jatuh tempo
                Denda: this.formatIDR(totalDendaAngsuran),        // Format denda ke dalam IDR
              });
          
              // Hitung jumlah angsuran yang terlambat
              angsuranBelumDibayar += 1;
            }
          });
          
          // Return hasil akhir, termasuk jumlah angsuran yang belum dibayar
          return {
            data: {
              totalDenda: this.formatIDR(totalDenda),  // Total denda keseluruhan diformat ke IDR
              dendaPerAngsuran,                       // Denda per angsuran
              jumlahAngsuranBelumDibayar: angsuranBelumDibayar, // Jumlah angsuran yang belum dibayar
            },
            statusCode: HttpStatus.OK  // Status code 200 menandakan sukses
          };
        } catch (error) {
          throw error;  // Jika terjadi error, lemparkan untuk debugging
        }
      }

    // Fungsi untuk memformat angka ke IDR
    private formatIDR(value: string | number): string {
        const numberValue = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(numberValue)) return 'Invalid Number';

        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(numberValue);
    }
}
