// app\api\wallet\route.ts
import { NextRequest } from 'next/server';
import { createWallet, getWallet, getWalletBalance } from '../../../lib/walletController';

export async function GET(req: NextRequest) {
  try {
    console.log('Received GET request:', req.url);
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      console.error('Error: userId is required');
      return new Response(JSON.stringify({ error: 'userId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`Fetching wallet for userId: ${userId}`);
    const wallet = await getWallet(userId);
    const balance = await getWalletBalance(userId);
    console.log('Wallet fetched successfully:', { ...wallet, balance });

    return new Response(JSON.stringify({ ...wallet, balance }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in GET handler:', error instanceof Error ? error.message : error);
    console.error('Stack Trace:', error instanceof Error ? error.stack : 'No stack trace available');
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'An unknown error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('Received POST request');
    const { userId } = await req.json();

    if (!userId) {
      console.error('Error: userId is required');
      return new Response(JSON.stringify({ error: 'userId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`Creating wallet for userId: ${userId}`);
    const newWallet = await createWallet(userId);
    console.log('Wallet created successfully:', newWallet);

    return new Response(JSON.stringify(newWallet), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in POST handler:', error instanceof Error ? error.message : error);
    console.error('Stack Trace:', error instanceof Error ? error.stack : 'No stack trace available');
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'An unknown error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
