import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

interface Wallet {
  userId: string;
  publicKey: string;
  encryptedPrivateKey: string;
  balance: number;
  createdAt: Date;
}

export async function createWallet(userId: string): Promise<{ publicKey: string }> {
  const client = await clientPromise;
  const db = client.db('JelqAI');
  const wallet: Wallet = {
    userId,
    publicKey: new ObjectId().toHexString(),
    encryptedPrivateKey: "exampleEncryptedPrivateKey",
    balance: 0, // Initialize balance to 0
    createdAt: new Date(),
  };

  const result = await db.collection('wallets').insertOne(wallet);
  return { publicKey: wallet.publicKey };
}

function isWallet(doc: any): doc is Wallet {
  console.log('Inspecting document fields:', doc);
  const isValid =
    typeof doc === 'object' &&
    doc !== null &&
    typeof doc.userId === 'string' &&
    typeof doc.publicKey === 'string' &&
    typeof doc.encryptedPrivateKey === 'string' &&
    typeof doc.balance === 'number' &&
    doc.createdAt instanceof Date;

  console.log('Validation result:', isValid);
  return isValid;
}

export async function getWallet(userId: string): Promise<Wallet> {
  const client = await clientPromise;
  const db = client.db('JelqAI');
  console.log(`Fetching wallet from MongoDB for userId: ${userId}`);
  const wallet = await db.collection('wallets').findOne({ userId });

  if (!wallet) {
    console.error('Wallet not found for userId:', userId);
    throw new Error('Wallet not found');
  }

  console.log('Retrieved wallet document:', wallet); // Add this log to inspect the document

  if (!isWallet(wallet)) {
    console.error('Document does not match Wallet interface for userId:', userId);
    throw new Error('Document does not match Wallet interface');
  }

  console.log('Wallet fetched successfully:', wallet);
  return wallet;
}

export async function getWalletBalance(userId: string): Promise<number> {
  const client = await clientPromise;
  const db = client.db('JelqAI');
  console.log(`Fetching wallet balance from MongoDB for userId: ${userId}`);
  const wallet = await db.collection('wallets').findOne({ userId });

  if (!wallet) {
    console.error('Wallet not found for userId:', userId);
    throw new Error('Wallet not found');
  }

  console.log('Wallet balance fetched successfully:', wallet.balance);
  return wallet.balance;
}
