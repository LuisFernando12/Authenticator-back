import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewRelations1774635809706 implements MigrationInterface {
    name = 'AddNewRelations1774635809706'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_63301650f99948e1ff5e0af00b5"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "REL_63301650f99948e1ff5e0af00b"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tokenId"`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_94f168faad896c0786646fa3d4a"`);
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "consent_id"`);
        await queryRunner.query(`ALTER TABLE "token" ADD "consent_id" uuid`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "REL_94f168faad896c0786646fa3d4"`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_94f168faad896c0786646fa3d4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_05a10371b154ac5154eefdb36e9" FOREIGN KEY ("consent_id") REFERENCES "user_client_consent"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_05a10371b154ac5154eefdb36e9"`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_94f168faad896c0786646fa3d4a"`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "REL_94f168faad896c0786646fa3d4" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "consent_id"`);
        await queryRunner.query(`ALTER TABLE "token" ADD "consent_id" character varying`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_94f168faad896c0786646fa3d4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD "tokenId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "REL_63301650f99948e1ff5e0af00b" UNIQUE ("tokenId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_63301650f99948e1ff5e0af00b5" FOREIGN KEY ("tokenId") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
