// app/access-wallet/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useTypedSession } from '@/hooks/use-typed-session'; // Import your custom hook
import { useSession, signIn } from 'next-auth/react'; // Import signIn from next-auth/react
import axios from 'axios';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface WalletInfo {
  publicKey: string;
  balance: number;
}

interface Transaction {
  date: string;
  amount: number;
  description: string;
}

const AccessWallet = () => {
  const { data: session, status } = useTypedSession();
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [message, setMessage] = useState('');

  const handleFetchWallet = async () => {
    if (!session?.user?.id) {
      setMessage('Error: User not authenticated');
      return;
    }

    try {
      console.log(`Fetching wallet for userId: ${session.user.id}`);
      const response = await axios.get(`/api/wallet?userId=${session.user.id}`);
      console.log('Wallet fetched successfully:', response.data);
      setWalletInfo(response.data);
      setMessage('');

      // Fetch transactions
      const transactionsResponse = await axios.get(`/api/transactions?userId=${session.user.id}`);
      setTransactions(transactionsResponse.data);
    } catch (error) {
      console.error('Error fetching wallet:', error);
      setWalletInfo(null);
      setTransactions([]);
      if (axios.isAxiosError(error)) {
        setMessage(`Error fetching wallet: ${error.response?.data.error}`);
      } else {
        setMessage('Error fetching wallet: Unknown error occurred');
      }
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      handleFetchWallet();
    }
  }, [session?.user?.id]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center">
      <h1 className="text-4xl font-bold mb-4">Access Existing Wallet</h1>
      {session ? (
        <div>
          <button
            onClick={handleFetchWallet}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Fetch Wallet
          </button>
          {walletInfo && (
            <div className="mt-4">
              <p><strong>Public Key:</strong> {walletInfo.publicKey}</p>
              <p><strong>Balance:</strong> {walletInfo.balance} Tokens</p>
            </div>
          )}
          {transactions.length > 0 && (
            <div className="mt-4">
              <h2 className="text-2xl font-bold mb-2">Transaction History</h2>
              <ul>
                {transactions.map((transaction, index) => (
                  <li key={index} className="mb-2">
                    <p><strong>Date:</strong> {transaction.date}</p>
                    <p><strong>Amount:</strong> {transaction.amount} Tokens</p>
                    <p><strong>Description:</strong> {transaction.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {message && <p className="mt-4">{message}</p>}
          <div className="mt-4">
            <Button asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
          <div className="mt-8 bg-black text-white p-4 rounded"> {/* Update background and text color */}
            <h2 className="text-2xl font-bold mb-2">Security Notice</h2>
            <ul className="list-disc list-inside">
              <li>Never share your private key or recovery phrase with anyone.</li>
              <li>Enable two-factor authentication (2FA) for an additional layer of security.</li>
              <li>Regularly check your transaction history for any suspicious activity.</li>
              <li>Use a hardware wallet for storing large amounts of tokens.</li>
              <li>Always keep your software updated to the latest version.</li>
            </ul>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-xl mb-4">You need to sign in to access your wallet.</p>
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

export default AccessWallet;
