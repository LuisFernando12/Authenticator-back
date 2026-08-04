import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReasonColumnOnSecurityEventTable1785872348964 implements MigrationInterface {
    name = 'AddReasonColumnOnSecurityEventTable1785872348964'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "security_event" ADD "reason" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "security_event" DROP COLUMN "reason"`);
    }

}
