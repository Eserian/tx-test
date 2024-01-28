import { Controller, Get } from '@nestjs/common';
import { TxService } from './tx-api.service';
import { TopBalanceChangeAddressDto } from '../dto/top-balance-change-address.dto';

@Controller('tx-api')
export class TxController {
  constructor(private readonly txService: TxService) {}

  @Get('top-balance-change-address')
  async getTopBalanceChangeAddres(): Promise<TopBalanceChangeAddressDto> {
    return await this.txService.getTopBalanceChangeAddress();
  }
}
