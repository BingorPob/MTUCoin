// hooks/use-session.ts
import { useSession, signIn, signOut } from "next-auth/react";

export default function useSessionManagement() {
  const { data: session, status } = useSession();

  return { session, status, signIn, signOut };
}
