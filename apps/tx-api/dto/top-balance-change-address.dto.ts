import { ApiProperty } from '@nestjs/swagger';

export class TopBalanceChangeAddressDto {
  @ApiProperty()
  address: string;

  constructor(data: TopBalanceChangeAddressDto) {
    this.address = data.address;
  }
}
