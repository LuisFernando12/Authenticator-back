import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTokenEntity1774569236242 implements MigrationInterface {
    name = 'UpdateTokenEntity1774569236242'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" RENAME COLUMN "token" TO "consent_id"`);
        await queryRunner.query(`ALTER TABLE "token" ALTER COLUMN "consent_id" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" ALTER COLUMN "consent_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "token" RENAME COLUMN "consent_id" TO "token"`);
    }

}
