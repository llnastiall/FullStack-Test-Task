import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import {UserEntity} from "../../users/entities/user.entity";

@Entity('projects')
export class ProjectEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UserEntity, user => user.projects, { eager: true })
    user: UserEntity;

    @Column()
    owner: string;

    @Column()
    name: string;

    @Column()
    url: string;

    @Column({ default: 0 })
    stars: number;

    @Column({ default: 0 })
    forks: number;

    @Column({ default: 0 })
    issues: number;

    @Column()
    createdAt: string;
}
