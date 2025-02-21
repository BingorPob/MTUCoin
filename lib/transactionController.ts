// transactionController.ts
import clientPromise from './mongodb';
import { ObjectId, Document, WithId } from 'mongodb';

interface Transaction {
  userId: string;
  date: Date;
  amount: number;
  description: string;
}

export async function getTransactions(userId: string): Promise<Transaction[]> {
  const client = await clientPromise;
  const db = client.db('JelqAI');
  console.log(`Fetching transactions from MongoDB for userId: ${userId}`);

  const transactions: WithId<Document>[] = await db.collection('transactions').find({ userId }).sort({ date: -1 }).toArray();

  // Map the MongoDB documents to the Transaction type
  const mappedTransactions: Transaction[] = transactions.map((transaction) => ({
    userId: transaction.userId,
    date: new Date(transaction.date),
    amount: transaction.amount,
    description: transaction.description
  }));

  console.log('Transactions fetched successfully:', mappedTransactions);
  return mappedTransactions;
}
