import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserClientConsent1774643779395 implements MigrationInterface {
    name = 'UpdateUserClientConsent1774643779395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_client_consent" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user_client_consent" DROP COLUMN "clientId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_client_consent" ADD "clientId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_client_consent" ADD "userId" character varying NOT NULL`);
    }

}
