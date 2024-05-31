import { Ticket } from 'src/tickets/entities/ticket.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  age: number;

  @Column({ default: false })
  isManager: boolean;

  @OneToMany(() => Ticket, (ticket) => ticket.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  tickets: Ticket[];
}
