'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/login');
  }, [router]);
  
  return (
    <div className="h-screen flex justify-center items-center">
      <h1 className="text-6xl">SIM-Manager</h1>
    </div>
  );
}

