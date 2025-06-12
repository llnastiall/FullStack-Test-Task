import {Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req, Patch} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateProjectDto } from './dto/create-project.dto';
import {ProjectService} from "./projects.service";
import {JwtAuthGuard} from "../common/guards/jwt-auth.guard";

@ApiTags('Projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати список проектів користувача' })
  @ApiResponse({ status: 200, description: 'Список проектів' })
  async getProjects(@Req() req) {
    return this.projectService.getProjectsForUser(req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Додати новий проект' })
  @ApiResponse({ status: 201, description: 'Проект доданий' })
  async addProject(@Req() req, @Body() dto: CreateProjectDto) {
    return this.projectService.addProject(req.user.userId, dto);
  }

  @Patch(':id/update-github')
  @ApiOperation({ summary: 'Оновити статистику проекту з GitHub' })
  updateFromGithub(@Req() req, @Param('id') id: string) {
    return this.projectService.updateProjectFromGithub(req.user, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити проект' })
  @ApiResponse({ status: 200, description: 'Проект видалено' })
  async deleteProject(@Req() req, @Param('id') id: string) {
    return this.projectService.deleteProject(req.user.userId, id);
  }

}
