import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldJTIOnTokenEntity1774983919333 implements MigrationInterface {
  name = 'AddFieldJTIOnTokenEntity1774983919333';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('token', 'jti');
    if (!hasColumn) {
      await queryRunner.query(`ALTER TABLE "token" ADD "jti" uuid NOT NULL`);
    }
    const table = await queryRunner.getTable('token');
    const hasIndex = table.uniques.some(
      (column) => column.name === 'UQ_7e0bb4f81da27f8a13b93d25b72',
    );
    if (!hasIndex) {
      await queryRunner.query(
        `ALTER TABLE "token" ADD CONSTRAINT "UQ_7e0bb4f81da27f8a13b93d25b72" UNIQUE ("jti")`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "UQ_7e0bb4f81da27f8a13b93d25b72"`,
    );
    await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "jti"`);
  }
}
