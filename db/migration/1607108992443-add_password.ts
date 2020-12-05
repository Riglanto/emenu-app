import {MigrationInterface, QueryRunner} from "typeorm";

export class addPassword1607108992443 implements MigrationInterface {
    name = 'addPassword1607108992443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    //    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    }

}
