import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {toast} from "sonner";
import {FaCodeFork, FaStar} from "react-icons/fa6";
import {FaExclamationTriangle} from "react-icons/fa";

interface Project {
    id: string;
    owner: string;
    name: string;
    url: string;
    stars: number;
    forks: number;
    issues: number;
    createdAt: string;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [repoPath, setRepoPath] = useState('');

    const [isAdding, setIsAdding] = useState(false);

    const fetchProjects = async () => {
        const res = await api.get('/projects');
        setProjects(res.data);
    };

    const handleAdd = async () => {
        try {
            setIsAdding(true);
            await api.post('/projects', { path: repoPath });
            setRepoPath('');
            fetchProjects();
        } catch (e:any){
            toast.error(`Не вдалося додати ${e.response?.data?.message.join()}`);
        } finally {
            setIsAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        await api.delete(`/projects/${id}`);
        fetchProjects();
    };

    const handleUpdate = async (id: string) => {
        await api.patch(`/projects/${id}/update-github`);
        fetchProjects();
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="w-screen min-h-screen px-4 py-10 flex flex-col items-center">
            <Card className="border-none shadow-none w-full max-w-2xl p-6 space-y-6">
                <CardContent className="space-y-4">
                    <h2 className="text-2xl font-semibold text-center">Ваші проєкти</h2>
                    <div className="flex gap-2">
                        <Input
                            placeholder="facebook/react"
                            value={repoPath}
                            onChange={(e) => setRepoPath(e.target.value)}
                        />
                        <Button onClick={handleAdd} disabled={isAdding}>Додати</Button>
                    </div>

                    <ul className="space-y-4">
                        {projects.map((p) => (
                            <li key={p.id} className="border rounded-lg p-4 shadow-sm bg-white">
                                <div className="font-medium">
                                    <div className={'flex gap-3'}>
                                        <b>{p.owner}/{p.name}:</b>
                                        <div className={'flex gap-3'}>
                                            <div className={'flex justify-center items-center'}><FaStar/> {p.stars}
                                            </div>
                                            <div className={'flex justify-center items-center'}><FaCodeFork/> {p.forks}
                                            </div>
                                            <div className={'flex justify-center items-center'}>
                                                <FaExclamationTriangle/> {p.issues}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm mt-1">
                                    <a
                                        href={p.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Посилання
                                    </a>
                                </div>
                                <div className="text-sm text-gray-600">Створено: {new Date(p.createdAt).toLocaleString()}</div>
                                <div className="mt-2 flex gap-2">
                                    <Button variant="outline" onClick={() => handleUpdate(p.id)}>
                                        Оновити
                                    </Button>
                                    <Button variant={'ghost'} onClick={() => handleDelete(p.id)}>
                                        Видалити
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
