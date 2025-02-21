'use client';

import { useEffect, useState } from 'react';
import { useTypedSession } from '@/hooks/use-typed-session'; // Import your custom hook
import { signIn } from 'next-auth/react'; // Import signIn from next-auth/react
import axios from 'axios';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const CreateWallet = () => {
  const { data: session, status } = useTypedSession(); // Use the custom hook for typed session
  const [hasWallet, setHasWallet] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  useEffect(() => {
    const fetchWalletInfo = async () => {
      if (session?.user?.id) {
        try {
          const response = await axios.get(`/api/wallet?userId=${session.user.id}`);
          if (response.data) {
            setHasWallet(true);
            setWarningMessage('You already have a wallet linked to your account.');
          }
        } catch (error) {
          setHasWallet(false);
          setWarningMessage('');
        }
      }
    };

    if (session) {
      fetchWalletInfo();
    }
  }, [session]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center">
      <h1 className="text-4xl font-bold mb-4">Create Wallet</h1>
      {session ? (
        <div>
          {hasWallet && <p className="text-red-500 mb-4">{warningMessage}</p>}
          <Button asChild>
            <Link href="/create-wallet">Create Wallet</Link>
          </Button>
          <Button asChild>
            <Link href="/access-wallet">Access Wallet</Link>
          </Button>
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
