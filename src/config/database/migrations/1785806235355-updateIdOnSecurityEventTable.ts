import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateIdOnSecurityEventTable1785806235355 implements MigrationInterface {
    name = 'UpdateIdOnSecurityEventTable1785806235355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "security_event" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "security_event" ALTER COLUMN "id" DROP DEFAULT`);
    }

}
