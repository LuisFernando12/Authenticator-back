import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserEntityFieldCreatedAt1777667177983 implements MigrationInterface {
    name = 'UpdateUserEntityFieldCreatedAt1777667177983'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIME WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

}
