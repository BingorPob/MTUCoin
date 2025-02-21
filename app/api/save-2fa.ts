import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { userId, secret } = req.body;
  const client = await clientPromise;
  const db = client.db("JelqAI");

  await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { twoFactorEnabled: true, twoFactorSecret: secret } });

  res.status(200).end();
}
