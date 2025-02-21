// hooks/useTypedSession.ts
import { useSession } from 'next-auth/react';

// Manually define the TypedUser and TypedSession interfaces
interface TypedUser {
  id: string;
  twoFactorEnabled: boolean;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface TypedSession {
  user: TypedUser;
  expires: string;
}

export const useTypedSession = () => useSession() as { data: TypedSession | null; status: 'loading' | 'authenticated' | 'unauthenticated' };
