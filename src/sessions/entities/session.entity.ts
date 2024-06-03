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

  @Column()
  timeSlot: string;

  @Column()
  roomNumber: number;

  @ManyToOne(() => Movie, (movie) => movie.sessions, { onDelete: 'CASCADE' })
  movie: Movie;

  @OneToMany(() => Ticket, (ticket) => ticket.session, {
    cascade: true,
  })
  tickets: Ticket[];
}
