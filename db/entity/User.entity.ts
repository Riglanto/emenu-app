import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("UQ_97672ac88f789774dd47f7c8be3", ["email"], { unique: true })
@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "integer"})
  id: number;

  @Column("character varying", {nullable: true})
  password: string | null;

  @Column("character varying", { name: "name", nullable: true })
  name: string | null;

  @Column("character varying", { name: "email", nullable: true, unique: true })
  email: string | null;

  @Column("timestamp with time zone", {
    name: "email_verified",
    nullable: true,
  })
  emailVerified: Date | null;

  @Column("character varying", { name: "image", nullable: true })
  image: string | null;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @Column("timestamp with time zone", {
    name: "updated_at",
    default: () => "now()",
  })
  updatedAt: Date;
}
