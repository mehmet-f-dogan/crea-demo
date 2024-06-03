import { Role } from '../../roles/role.enum';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

const defaultRole = ['customer'];
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  age: number;

  @Column('simple-array')
  roles: string[] = defaultRole;

  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Ticket[];
}
