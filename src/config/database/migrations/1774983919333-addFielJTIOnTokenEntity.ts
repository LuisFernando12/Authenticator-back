import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFielJTIOnTokenEntity1774983919333 implements MigrationInterface {
    name = 'AddFielJTIOnTokenEntity1774983919333'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" ADD "jti" uuid NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "jti"`);
    }

}
