import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableToken1781549447172 implements MigrationInterface {
    name = 'UpdateTableToken1781549447172'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_94f168faad896c0786646fa3d4a"`);
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "token" ADD "token_family_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "token" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_e50ca89d635960fda2ffeb17639" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_e50ca89d635960fda2ffeb17639"`);
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "token_family_id"`);
        await queryRunner.query(`ALTER TABLE "token" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_94f168faad896c0786646fa3d4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
