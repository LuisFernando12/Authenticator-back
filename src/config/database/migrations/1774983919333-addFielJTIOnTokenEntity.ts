import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldJTIOnTokenEntity1774983919333 implements MigrationInterface {
  name = 'AddFieldJTIOnTokenEntity1774983919333';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "token" ADD "jti" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "UQ_7e0bb4f81da27f8a13b93d25b72" UNIQUE ("jti")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "UQ_7e0bb4f81da27f8a13b93d25b72"`,
    );
    await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "jti"`);
  }
}
