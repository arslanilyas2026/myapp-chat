import { auth, hasCredentials } from "@/config/firebase";
import { type User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export interface AuthState {
  user: FirebaseUser | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Firebase is not configured (no real API key), immediately
    // resolve as logged-out so the app renders without waiting.
    if (!hasCredentials) {
      setUser(null);
      setLoading(false);
      return;
    }

    let unsubscribe: () => void;
    try {
      unsubscribe = onAuthStateChanged(
        auth,
        (firebaseUser) => {
          setUser(firebaseUser);
          setLoading(false);
        },
        () => {
          setUser(null);
          setLoading(false);
        },
      );
    } catch {
      setUser(null);
      setLoading(false);
      return;
    }
    return () => unsubscribe?.();
  }, []);

  return { user, loading };
}
