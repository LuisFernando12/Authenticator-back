import { MigrationInterface, QueryRunner } from "typeorm";

export class NewTableToSecurityEventsPersistence1785799430399 implements MigrationInterface {
    name = 'NewTableToSecurityEventsPersistence1785799430399'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."security_event_type_enum" AS ENUM('INVALID_LOGIN_ATTEMPT', 'MULTIPLE_IPS_DETECTED', 'SIMULTANEOUS_SESSIONS', 'MANUAL_TOKEN_REVOCATION', 'PASSWORD_RESET_REQUESTED', 'REFRESH_TOKEN_REUSED', 'OTHER')`);
        await queryRunner.query(`CREATE TYPE "public"."security_event_severity_enum" AS ENUM('INFORMATIONAL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL')`);
        await queryRunner.query(`CREATE TABLE "security_event" ("id" uuid NOT NULL, "type" "public"."security_event_type_enum" NOT NULL DEFAULT 'OTHER', "ip" character varying NOT NULL, "userAgent" character varying NOT NULL, "email" character varying NOT NULL, "severity" "public"."security_event_severity_enum" NOT NULL DEFAULT 'INFORMATIONAL', "occurred_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_fb070407ce281c218223836bad4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "security_event"`);
        await queryRunner.query(`DROP TYPE "public"."security_event_severity_enum"`);
        await queryRunner.query(`DROP TYPE "public"."security_event_type_enum"`);
    }

}
