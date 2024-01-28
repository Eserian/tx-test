import { Injectable, NotFoundException } from '@nestjs/common';
import { Tx } from 'shared/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TopBalanceChangeAddressDto } from '../dto/top-balance-change-address.dto';

@Injectable()
export class TxService {
  constructor(
    @InjectRepository(Tx)
    private readonly txRepository: Repository<Tx>,
  ) {}

  async getTopBalanceChangeAddress(): Promise<TopBalanceChangeAddressDto> {
    const highestSavedBlockNumber =
      await this.txRepository.maximum('blockNumber');

    if (!highestSavedBlockNumber) {
      throw new NotFoundException();
    }

    const startBlock = highestSavedBlockNumber - 100;

    const sendersGroup = await this.txRepository
      .createQueryBuilder('tx')
      .select(['tx.from AS address', '-SUM(tx.value) as total'])
      .where('tx.blockNumber > :startBlock', { startBlock })
      .groupBy('tx.from')
      .getRawMany();

    const recipientsGroup = await this.txRepository
      .createQueryBuilder('tx')
      .select(['tx.to AS address', 'SUM(tx.value) as total'])
      .where('tx.blockNumber > :startBlock', { startBlock })
      .groupBy('tx.to')
      .getRawMany();

    const totalAccountChanges: { [key: string]: number } = [
      ...sendersGroup,
      ...recipientsGroup,
    ].reduce((accumulator, entry) => {
      const { address, total } = entry;

      const alreadyAddedAddress = accumulator.hasOwnProperty(address);

      if (!alreadyAddedAddress) {
        accumulator[address] = +total;
        return accumulator;
      }

      accumulator[address] += +total;
      return accumulator;
    }, {});

    const maxChangedAccount = Object.entries(totalAccountChanges).reduce(
      (max, [address, value]) => {
        const absValue = Math.abs(value);
        return absValue > max.value ? { address, value: absValue } : max;
      },
      { address: '', value: 0 },
    );

    return new TopBalanceChangeAddressDto({
      address: maxChangedAccount.address,
    });
  }
}
