import { Controller, Get } from '@nestjs/common';
import { TxService } from './tx-api.service';
import { TopBalanceChangeAddressDto } from '../dto/top-balance-change-address.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('tx-api')
@ApiTags('transactions')
export class TxController {
  constructor(private readonly txService: TxService) {}

  @Get('top-balance-change-address')
  @ApiOkResponse({ type: TopBalanceChangeAddressDto })
  async getTopBalanceChangeAddres(): Promise<TopBalanceChangeAddressDto> {
    return await this.txService.getTopBalanceChangeAddress();
  }
}
