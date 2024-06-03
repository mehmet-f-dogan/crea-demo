import { Role } from '../../roles/role.enum';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

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

  @Column('enum', { enum: Role, array: true, default: [Role.Customer] })
  roles: Role[];

  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Ticket[];
}
