import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSecurityEventTypeEnumOnSecurityEventTable1785870814698 implements MigrationInterface {
    name = 'UpdateSecurityEventTypeEnumOnSecurityEventTable1785870814698'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."security_event_type_enum" RENAME TO "security_event_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."security_event_type_enum" AS ENUM('INVALID_LOGIN_ATTEMPT', 'INVALID_OAUTH_LOGIN_ATTEMPT', 'MULTIPLE_IPS_DETECTED', 'SIMULTANEOUS_SESSIONS', 'MANUAL_TOKEN_REVOCATION', 'PASSWORD_RESET_REQUESTED', 'REFRESH_TOKEN_REUSED', 'OTHER')`);
        await queryRunner.query(`ALTER TABLE "security_event" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "security_event" ALTER COLUMN "type" TYPE "public"."security_event_type_enum" USING "type"::"text"::"public"."security_event_type_enum"`);
        await queryRunner.query(`ALTER TABLE "security_event" ALTER COLUMN "type" SET DEFAULT 'OTHER'`);
        await queryRunner.query(`DROP TYPE "public"."security_event_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."security_event_type_enum_old" AS ENUM('INVALID_LOGIN_ATTEMPT', 'MULTIPLE_IPS_DETECTED', 'SIMULTANEOUS_SESSIONS', 'MANUAL_TOKEN_REVOCATION', 'PASSWORD_RESET_REQUESTED', 'REFRESH_TOKEN_REUSED', 'OTHER')`);
        await queryRunner.query(`ALTER TABLE "security_event" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "security_event" ALTER COLUMN "type" TYPE "public"."security_event_type_enum_old" USING "type"::"text"::"public"."security_event_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "security_event" ALTER COLUMN "type" SET DEFAULT 'OTHER'`);
        await queryRunner.query(`DROP TYPE "public"."security_event_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."security_event_type_enum_old" RENAME TO "security_event_type_enum"`);
    }

}
