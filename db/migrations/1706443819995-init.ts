import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1706443819995 implements MigrationInterface {
    name = 'Init1706443819995'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tx" ("id" SERIAL NOT NULL, "blockNumber" numeric NOT NULL, "from" character varying NOT NULL, "to" character varying, "value" numeric NOT NULL, CONSTRAINT "PK_2e04a1db73a003a59dcd4fe916b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tx"`);
    }

}
