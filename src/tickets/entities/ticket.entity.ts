// ticket.entity.ts
import { Session } from 'src/sessions/entities/session.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.tickets)
  user: User;

  @ManyToOne(() => Session, (session) => session.tickets)
  session: Session;

  @Column({ default: false })
  isRedeemed: boolean;
}
