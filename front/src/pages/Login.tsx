import { useState } from 'react';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {toast} from "sonner";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await api.post('/auth/login', { email, password });
            console.log(response);
            localStorage.setItem('token', response.data.access_token);
            navigate('/projects');
        } catch (e: any) {
            toast.error(`Помилка авторизації ${e.response?.data?.message.join()}`);
        }
    };

    return (
        <div className="w-screen flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <Card className="w-full max-w-sm p-6">
                <CardContent className="space-y-4">
                    <h2 className="text-2xl font-semibold text-center">Увійти</h2>
                    <Input
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Input
                        placeholder="Пароль"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Button className="w-full" onClick={handleLogin}>
                        Увійти
                    </Button>
                    <p className="text-sm text-center">
                        Ще немає акаунта?{' '}
                        <Link to="/register" className="text-blue-900 hover:underline">
                            Зареєструватися
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
