import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {ProjectEntity} from "../../projects/entities/project.entity";

@Entity('users')
export class UserEntity {
    @ApiProperty({ example: '9b1deb4d-5b3d-457d-990d-3b6b2f45e3f0' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'user@example.com' })
    @Column({ unique: true })
    email: string;

    @ApiProperty({ example: '$2b$10$hash' })
    @Column()
    password: string;

    @ApiProperty({ example: '2024-06-12T10:45:32.345Z' })
    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => ProjectEntity, (project) => project.owner)
    projects: ProjectEntity[];
}
