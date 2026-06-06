import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableNameToConsent1780686454336 implements MigrationInterface {
    name = 'UpdateTableNameToConsent1780686454336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_05a10371b154ac5154eefdb36e9"`);
        await queryRunner.query(`CREATE TABLE "consent" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "scopes" text array NOT NULL, "user_id" uuid NOT NULL, "client_id" character varying NOT NULL, "grantedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "expires_at" TIMESTAMP, "revoke_at" TIMESTAMP, CONSTRAINT "PK_9115e8d6b082d4fc46d56134d29" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "consent" ADD CONSTRAINT "FK_a5cfa7e467568ab0f36ff55058b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consent" ADD CONSTRAINT "FK_0e984f4e2e451260a3ec425aab6" FOREIGN KEY ("client_id") REFERENCES "client"("client_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_05a10371b154ac5154eefdb36e9" FOREIGN KEY ("consent_id") REFERENCES "consent"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_05a10371b154ac5154eefdb36e9"`);
        await queryRunner.query(`ALTER TABLE "consent" DROP CONSTRAINT "FK_0e984f4e2e451260a3ec425aab6"`);
        await queryRunner.query(`ALTER TABLE "consent" DROP CONSTRAINT "FK_a5cfa7e467568ab0f36ff55058b"`);
        await queryRunner.query(`DROP TABLE "consent"`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_05a10371b154ac5154eefdb36e9" FOREIGN KEY ("consent_id") REFERENCES "user_client_consent"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
