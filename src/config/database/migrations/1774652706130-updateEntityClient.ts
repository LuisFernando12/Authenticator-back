import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntityClient1774652706130 implements MigrationInterface {
    name = 'UpdateEntityClient1774652706130'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" RENAME COLUMN "clientId" TO "client_id"`);
        await queryRunner.query(`ALTER TABLE "client" RENAME CONSTRAINT "UQ_6ed9067942d7537ce359e172ff6" TO "UQ_7510ce0a84bde51dbff978b4b49"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" RENAME CONSTRAINT "UQ_7510ce0a84bde51dbff978b4b49" TO "UQ_6ed9067942d7537ce359e172ff6"`);
        await queryRunner.query(`ALTER TABLE "client" RENAME COLUMN "client_id" TO "clientId"`);
    }

}
