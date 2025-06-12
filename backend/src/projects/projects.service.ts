import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ProjectEntity } from './entities/project.entity';

@Injectable()
export class ProjectService {
  constructor(
      @InjectRepository(ProjectEntity)
      private readonly projectRepository: Repository<ProjectEntity>,
      private readonly httpService: HttpService,
  ) {}

  async getProjectsForUser(userId: string) {
    return this.projectRepository.find({
      where: { user: { id: userId } },
      relations: { user: true },
    });
  }

  private parsePath(path: string): { owner: string; repo: string } {
    const parts = path.split('/');
    if (parts.length !== 2) {
      throw new BadRequestException('Path must be in format "owner/repo"');
    }
    return { owner: parts[0], repo: parts[1] };
  }

  private parseGithubUrl(url: string): { owner: string; repo: string } {
    try {
      const pathParts = new URL(url).pathname.split('/').filter(Boolean);
      if (pathParts.length < 2) throw new Error('Invalid GitHub URL');
      return { owner: pathParts[0], repo: pathParts[1] };
    } catch {
      throw new BadRequestException('Invalid URL format');
    }
  }

  private async fetchGithubRepo(owner: string, repo: string) {
    try {
      const response = await firstValueFrom(
          this.httpService.get(`https://api.github.com/repos/${owner}/${repo}`),
      );
      return response.data;
    } catch {
      return null;
    }
  }

  async addProject(userId: string, dto: CreateProjectDto) {
    const { owner, repo } = this.parsePath(dto.path);

    const exists = await this.projectRepository.findOne({
      where: { owner, name: repo, user: { id: userId } },
    });
    if (exists) {
      throw new BadRequestException('Project already added');
    }

    const repoData = await this.fetchGithubRepo(owner, repo);
    if (!repoData) {
      throw new NotFoundException('Repository not found on GitHub');
    }

    const project = this.projectRepository.create({
      name: repo,
      url: repoData.html_url,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      issues: repoData.open_issues_count,
      createdAt: repoData.created_at,
      owner,
      user: { id: userId },
    });

    return this.projectRepository.save(project);
  }

  async deleteProject(userId: string, projectId: string) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId, user: { id: userId } },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.projectRepository.remove(project);
    return { message: 'Project deleted successfully' };
  }

  async updateProjectFromGithub(user: { userId: string; email: string }, projectId: string): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: { user: true },
    });

    if (!project) throw new NotFoundException('Project not found');

    if (project.user.id !== user.userId) throw new ForbiddenException('Access denied');

    const { owner, repo } = this.parseGithubUrl(project.url);
    const repoData = await this.fetchGithubRepo(owner, repo);
    if (!repoData) {
      throw new NotFoundException('Repository not found on GitHub');
    }

    project.stars = repoData.stargazers_count;
    project.forks = repoData.forks_count;
    project.issues = repoData.open_issues_count;
    project.createdAt = repoData.created_at;

    return this.projectRepository.save(project);
  }
}
