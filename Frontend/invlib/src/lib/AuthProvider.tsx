import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuth } from '@/api/auth';
import { User } from '@/types/User';
import { useUser } from '@/components/common/GlobalContext';

export default function withAuth(Component: any) {
    const AuthenticatedComponent = () => {
        const router = useRouter();
        const [data, setData] = useState<User>();
        const { user, setUser } = useUser();
        
        useEffect(() => {
            const getUser = async () => {
                try {
                    const response = await checkAuth();
                    const userData = response?.user;
                    if (!userData) {
                        router.push('/');
                    } else {
                        setData(userData)
                        setUser(userData);
                    }
                }
                catch (error) {
                    console.error(error);
                    router.push('/');
                }
            };
            getUser();
        }, [router]);

        return !!data ? <Component data={data} /> : null;
    };

    return AuthenticatedComponent;
};