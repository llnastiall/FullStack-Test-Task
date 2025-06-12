import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import {ProjectController} from "./projects.controller";
import {ProjectService} from "./projects.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProjectEntity} from "./entities/project.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity]), HttpModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectsModule {}
