// movie.entity.ts
import { Session } from 'src/sessions/entities/session.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  minimumAge: number;

  @OneToMany(() => Session, (session) => session.movie, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  sessions: Session[];
}
