import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnDeletedAt1782763043015 implements MigrationInterface {
    name = 'AddColumnDeletedAt1782763043015'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "token" ADD "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "token" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "expires_at"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "token" ADD "expiresAt" TIMESTAMP NOT NULL`);
    }

}
