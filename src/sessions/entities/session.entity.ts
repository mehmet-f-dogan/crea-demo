import { Transform } from 'class-transformer';
import moment from 'moment';
import { Movie } from '../../movies/entities/movie.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
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

  @Column()
  @Transform(({ value }) => moment(value, 'DD.MM.YYYY').format('DD.MM.YYYY'), {
    toClassOnly: true,
  })
  @Transform(({ value }) => moment(value).format('YYYY-MM-DD'), {
    toPlainOnly: true,
  })
  date: string;

  @Column({ type: 'enum', enum: TimeSlot })
  timeSlot: TimeSlot;

  @Column()
  roomNumber: number;

  @ManyToOne(() => Movie, (movie) => movie.sessions, { onDelete: 'CASCADE' })
  movie: Movie;

  @OneToMany(() => Ticket, (ticket) => ticket.session, {
    cascade: true,
  })
  tickets: Ticket[];
}
