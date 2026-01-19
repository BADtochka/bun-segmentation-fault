import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoMigration1768663023509 implements MigrationInterface {
  name = 'AutoMigration1768663023509';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "phone_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phoneNumber" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "rtHash" character varying, "isActive" boolean NOT NULL DEFAULT true, "isRegistered" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_79eb044025ba6a6cd3e7e55fb85" UNIQUE ("phoneNumber"), CONSTRAINT "PK_2034c8bc8da57d18b69fd90bcfa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "password_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, "rtHash" character varying, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_bf4b8b8fa1ae7432e4501e6d6c3" UNIQUE ("username"), CONSTRAINT "PK_4cd77c9b2e2522ee9d3671b3bc1" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "password_user"`);
    await queryRunner.query(`DROP TABLE "phone_user"`);
  }
}
