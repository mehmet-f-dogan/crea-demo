// session.entity.ts
import { Movie } from 'src/movies/entities/movie.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

export enum TimeSlot {
  SLOT_10 = '10',
  SLOT_12 = '12',
  SLOT_14 = '14',
  SLOT_16 = '16',
  SLOT_18 = '18',
  SLOT_20 = '20',
  SLOT_22 = '22',
}

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'enum', enum: TimeSlot })
  timeSlot: TimeSlot;

  @Column()
  roomNumber: number;

  @ManyToOne(() => Movie, (movie) => movie.sessions)
  movie: Movie;

  @OneToMany(() => Ticket, (ticket) => ticket.session, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  tickets: Ticket[];
}
