import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntityUserClientConsent1774649178003 implements MigrationInterface {
    name = 'UpdateEntityUserClientConsent1774649178003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_client_consent" DROP COLUMN "createAt"`);
        await queryRunner.query(`ALTER TABLE "user_client_consent" ADD "grantedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user_client_consent" ADD "expires_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_client_consent" ADD "revoke_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_client_consent" DROP COLUMN "revoke_at"`);
        await queryRunner.query(`ALTER TABLE "user_client_consent" DROP COLUMN "expires_at"`);
        await queryRunner.query(`ALTER TABLE "user_client_consent" DROP COLUMN "grantedAt"`);
        await queryRunner.query(`ALTER TABLE "user_client_consent" ADD "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

}
