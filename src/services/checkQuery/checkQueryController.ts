import {Controller, Post } from '@nestjs/common';
import { CheckQueryServices } from './checkQueryServices';
@Controller('query')
export class checkQueryController {
  constructor(private readonly queryServices: CheckQueryServices) { }

  @Post('jatuh_tempo')
  async getData(
  ) {
    try {
        const getData = await this.queryServices.getTotalAngsuranJatuhTempo()

        return getData
    } catch (err){

    }
  }

  @Post('denda')
  async getDenda(
  ) {
    try {
        const getData = await this.queryServices.calculateDenda()

        return getData
    } catch (err){

    }
  }
}
