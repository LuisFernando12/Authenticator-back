import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEmailToNullableTrueOnSecurityEventTable1785866613743 implements MigrationInterface {
    name = 'UpdateEmailToNullableTrueOnSecurityEventTable1785866613743'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "security_event" ALTER COLUMN "email" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "security_event" ALTER COLUMN "email" SET NOT NULL`);
    }

}
