import {MigrationInterface, QueryRunner} from "typeorm";

export class syncDbWithTypeorm1607108137730 implements MigrationInterface {
    name = 'syncDbWithTypeorm1607108137730'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "UQ_95843cea26fc65b1a9d9b6e1d2b" ON "accounts" ("compound_id")`);
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "UQ_f10db2949bbea55b44f31108e1a" ON "sessions" ("session_token")`);
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "UQ_b02a7acc05fe8194bed8433cf25" ON "sessions" ("access_token")`);
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "UQ_97672ac88f789774dd47f7c8be3" ON "users" ("email")`);
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "UQ_77287cef70a4627091ae6d19c4d" ON "verification_requests" ("token")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "UQ_77287cef70a4627091ae6d19c4d"`);
        await queryRunner.query(`DROP INDEX "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`DROP INDEX "UQ_b02a7acc05fe8194bed8433cf25"`);
        await queryRunner.query(`DROP INDEX "UQ_f10db2949bbea55b44f31108e1a"`);
        await queryRunner.query(`DROP INDEX "UQ_95843cea26fc65b1a9d9b6e1d2b"`);
    }

}
