import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedAtColumnOnUserTable1785960442666 implements MigrationInterface {
    name = 'AddDeletedAtColumnOnUserTable1785960442666'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleted_at"`);
    }

}
