'use client';

import { useState } from 'react';
import { useTypedSession } from '@/hooks/use-typed-session'; // Import your custom hook
import { signIn } from 'next-auth/react'; // Import signIn from next-auth/react
import axios from 'axios';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const CreateWallet = () => {
  const { data: session, status } = useTypedSession(); // Use the custom hook for typed session
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      setMessage('Error: User not authenticated');
      return;
    }

    try {
      const response = await axios.post('/api/wallet', { userId: session.user.id });
      setMessage(`Wallet created! Public Key: ${response.data.publicKey}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(`Error creating wallet: ${error.response?.data.error}`);
      } else {
        setMessage('Error creating wallet: Unknown error occurred');
      }
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center">
      <h1 className="text-4xl font-bold mb-4">Create New Wallet</h1>
      {session ? (
        <div>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create Wallet
            </button>
          </form>
          {message && <p className="mt-4">{message}</p>}
          <div className="mt-4">
            <Button asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-xl mb-4">You need to sign in to create a wallet.</p>
          <button
            onClick={() => signIn()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateWallet;
