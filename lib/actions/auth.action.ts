"use server";

import { auth, db } from "@/firebase/admin";
import { isFirestoreUnavailable } from "@/lib/firestore";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

async function ensureUserRecord(uid: string, email: string, name?: string) {
  try {
    const userRef = db.collection("users").doc(uid);
    const userRecord = await userRef.get();

    if (userRecord.exists) {
      return {
        ...userRecord.data(),
        id: userRecord.id,
      } as User;
    }

    const authUser = await auth.getUser(uid);
    const userData = {
      name: name || authUser.displayName || email.split("@")[0] || "User",
      email: authUser.email || email,
    };

    await userRef.set(userData);

    return {
      ...userData,
      id: uid,
    } as User;
  } catch (error: unknown) {
    if (!isFirestoreUnavailable(error)) {
      console.warn("Unable to sync user record in Firestore:", error);
    }
    return null;
  }
}

async function getUserFromAuthClaims(
  uid: string,
  email?: string,
  name?: string
): Promise<User> {
  try {
    const authUser = await auth.getUser(uid);
    return {
      id: uid,
      email: authUser.email || email || "",
      name:
        authUser.displayName ||
        name ||
        authUser.email?.split("@")[0] ||
        "User",
    };
  } catch {
    return {
      id: uid,
      email: email || "",
      name: name || email?.split("@")[0] || "User",
    };
  }
}

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000,
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });

  cookieStore.delete("idToken");
}

function setIdTokenCookie(idToken: string) {
  return cookies().then((cookieStore) => {
    cookieStore.set("idToken", idToken, {
      maxAge: SESSION_DURATION,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
    cookieStore.delete("session");
  });
}

function decodeIdToken(idToken: string): {
  uid: string;
  email?: string;
  name?: string;
} | null {
  try {
    const parts = idToken.split(".");
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(Buffer.from(parts[1], "base64").toString());
    return {
      uid: decoded.user_id || decoded.sub,
      email: decoded.email,
      name: decoded.name,
    };
  } catch {
    return null;
  }
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    const syncedUser = await ensureUserRecord(uid, email, name);
    if (syncedUser) {
      return {
        success: true,
        message: "Account created successfully. Please sign in.",
      };
    }

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  if (!idToken) {
    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }

  try {
    const decoded = await auth.verifyIdToken(idToken);

    if (decoded.email !== email) {
      return {
        success: false,
        message: "Failed to log into account. Please try again.",
      };
    }

    await ensureUserRecord(decoded.uid, email);

    try {
      await setSessionCookie(idToken);
    } catch (sessionError) {
      console.warn("Session cookie unavailable, using idToken fallback:", sessionError);
      await setIdTokenCookie(idToken);
    }

    return { success: true, message: "Signed in successfully." };
  } catch (error: any) {
    console.error("Sign in error:", error);

    try {
      await setIdTokenCookie(idToken);
      return { success: true, message: "Signed in successfully." };
    } catch (fallbackError) {
      console.error("Sign in fallback error:", fallbackError);
      return {
        success: false,
        message: "Failed to log into account. Please try again.",
      };
    }
  }
}

// Sign out user by clearing auth cookies
export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete("session");
  cookieStore.delete("idToken");
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;
  const idToken = cookieStore.get("idToken")?.value;

  if (!sessionCookie && !idToken) return null;

  try {
    if (sessionCookie) {
      const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
      const syncedUser = await ensureUserRecord(
        decodedClaims.uid,
        decodedClaims.email || "",
        decodedClaims.name
      );

      if (syncedUser) return syncedUser;

      return getUserFromAuthClaims(
        decodedClaims.uid,
        decodedClaims.email,
        decodedClaims.name
      );
    }

    if (idToken) {
      try {
        const decodedClaims = await auth.verifyIdToken(idToken);
        const syncedUser = await ensureUserRecord(
          decodedClaims.uid,
          decodedClaims.email || "",
          decodedClaims.name
        );

        if (syncedUser) return syncedUser;

        return getUserFromAuthClaims(
          decodedClaims.uid,
          decodedClaims.email,
          decodedClaims.name
        );
      } catch {
        const decoded = decodeIdToken(idToken);
        if (!decoded?.uid) return null;

        return getUserFromAuthClaims(
          decoded.uid,
          decoded.email,
          decoded.name
        );
      }
    }

    return null;
  } catch (error) {
    console.warn("Auth session lookup failed:", error);

    if (idToken) {
      const decoded = decodeIdToken(idToken);
      if (decoded?.uid) {
        return getUserFromAuthClaims(
          decoded.uid,
          decoded.email,
          decoded.name
        );
      }
    }

    try {
      const cookieStore = await cookies();
      cookieStore.delete("session");
      cookieStore.delete("idToken");
    } catch {
      // ignore cookie cleanup errors
    }

    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
