import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { Tx } from 'shared/entities';
import { TTx } from 'shared/types';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';

const ETHERSCAN_API_URL = 'https://api.etherscan.io/api';

const DEFAULT_START_BLOCK = 19000000;

const BATCH_SIZE = 5; // etherscan per second request limit

const DELAY = 1000;

const axiosInstance = axios.create({
  baseURL: ETHERSCAN_API_URL,
  timeout: 5000,
});

@Injectable()
export class TxService {
  private startBlock = DEFAULT_START_BLOCK;

  private isWorkerActive = false;

  constructor(
    @InjectRepository(Tx)
    private readonly txRepository: Repository<Tx>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    await this.circle();
  }

  @Timeout(0)
  async handleTimeout() {
    const lastSavedBlockNumber = await this.getLastSavedBlockNumber();

    if (lastSavedBlockNumber > this.startBlock) {
      this.startBlock = lastSavedBlockNumber + 1;
    }

    await this.circle();
  }

  async circle() {
    if (this.isWorkerActive) {
      return;
    }
    this.isWorkerActive = true;
    console.log('worker started');
    const highestBlockNumber = await this.getHighestBlockNumber();

    try {
      await this.delay(DELAY); // wait after the first request so that we can send requests in batches without rate limit
      await this.processBlocksRange(this.startBlock, highestBlockNumber);
      this.startBlock = highestBlockNumber + 1;
      this.isWorkerActive = false;
    } catch (error) {
      console.log(error);
    }
  }

  async processBlocksRange(
    startBlock: number,
    endBlock: number,
  ): Promise<void> {
    for (
      let blockNumber = startBlock;
      blockNumber <= endBlock;
      blockNumber += BATCH_SIZE
    ) {
      const batchEndBlock = Math.min(blockNumber + BATCH_SIZE - 1, endBlock);
      await this.saveTxsInRange(blockNumber, batchEndBlock);
      await this.delay(DELAY);
    }
  }

  private async saveTxsInRange(
    startBlock: number,
    endBlock: number,
  ): Promise<void> {
    const txInfoPromises = [];

    for (let blockNumber = startBlock; blockNumber <= endBlock; blockNumber++) {
      console.log(`processing block ${blockNumber}`);
      txInfoPromises.push(this.getBlockInfo(blockNumber));
    }

    const txs = (await Promise.allSettled(txInfoPromises)).reduce((acc, p) => {
      if (p.status === 'fulfilled') {
        acc.push(...p.value.transactions);
      }
      return acc;
    }, []);

    await this.saveTxs(txs);
    console.log('txs saved', txs.length);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async getHighestBlockNumber(): Promise<number> {
    const response = await axiosInstance.get('/', {
      params: {
        module: 'proxy',
        action: 'eth_blockNumber',
        apikey: process.env.API_KEY,
      },
    });
    return parseInt(response.data.result, 16);
  }

  private async getBlockInfo(blockNumber: number): Promise<TTx> {
    const response = await axiosInstance.get('/', {
      params: {
        module: 'proxy',
        action: 'eth_getBlockByNumber',
        tag: `0x${blockNumber.toString(16)}`,
        boolean: true,
        apikey: process.env.API_KEY,
      },
    });
    return response.data.result;
  }

  private async saveTxs(txs: TTx[]): Promise<void> {
    const newTxs = [];
    for (const tx of txs) {
      const transaction = this.txRepository.create({
        ...tx,
        blockNumber: parseInt(tx.blockNumber),
        value: parseInt(tx.value),
      });
      newTxs.push(transaction);
    }

    await this.txRepository.save(newTxs);
  }

  private async getLastSavedBlockNumber(): Promise<number> {
    const highestSavedBlockNumber =
      await this.txRepository.maximum('blockNumber');

    return highestSavedBlockNumber ?? 0;
  }
}
