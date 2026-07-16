import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveRelationSessionWithToken1781834114530 implements MigrationInterface {
  name = 'RemoveRelationSessionWithToken1781834114530';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT IF EXISTS "FK_085d540d9f418cfbdc7bd55bb19"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT IF EXISTS "FK_3b579cac4725967200fd2faec5a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT IF EXISTS "FK_b99aa5e3456670dba185bde94d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT IF EXISTS "UQ_b99aa5e3456670dba185bde94d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT IF EXISTS "UQ_eb18885d8f0780ac5812ea7e48b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD COLUMN IF NOT EXISTS "token_family_id" character varying`,
    );
    await queryRunner.query(
      `UPDATE "sessions" SET "token_family_id" = "jti" WHERE "token_family_id" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD COLUMN IF NOT EXISTS "expires_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `UPDATE "sessions" SET "expires_at" = COALESCE("updated_at", "created_at", now()) WHERE "expires_at" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ALTER COLUMN "consent_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ALTER COLUMN "token_family_id" TYPE character varying USING "token_family_id"::text`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ALTER COLUMN "token_family_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ALTER COLUMN "expires_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP COLUMN IF EXISTS "session_count"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP COLUMN IF EXISTS "token_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_3b579cac4725967200fd2faec5a" FOREIGN KEY ("consent_id") REFERENCES "consent"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT IF EXISTS "FK_3b579cac4725967200fd2faec5a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT IF EXISTS "FK_085d540d9f418cfbdc7bd55bb19"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ALTER COLUMN "token_family_id" TYPE uuid USING "token_family_id"::uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ALTER COLUMN "consent_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "UQ_eb18885d8f0780ac5812ea7e48b" UNIQUE ("token_family_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "UQ_b99aa5e3456670dba185bde94d1" UNIQUE ("token_family_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_b99aa5e3456670dba185bde94d1" FOREIGN KEY ("token_family_id") REFERENCES "token"("token_family_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_3b579cac4725967200fd2faec5a" FOREIGN KEY ("consent_id") REFERENCES "consent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
