import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {toast} from "sonner";

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await api.post('/auth/register', { email, password });
            console.log(response);
            localStorage.setItem('token', response.data.access_token);
            navigate('/projects');
            toast.success('Реєстрація успішна!');
        } catch (e: any) {
            toast.error(`Помилка реєстрації ${e.response?.data?.message.join()}`);
        }
    };

    return (
        <div className="w-screen flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <Card className="w-full max-w-sm p-6">
                <CardContent className="space-y-4">
                    <h2 className="text-2xl font-semibold text-center">Реєстрація</h2>
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
                    <Button className="w-full" onClick={handleRegister}>
                        Зареєструватися
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
