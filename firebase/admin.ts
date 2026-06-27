import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function loadServiceAccountFromFile(): ServiceAccount | null {
  const envPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const credentialPath = envPath
    ? envPath.includes(":") || envPath.startsWith("/")
      ? envPath
      : join(process.cwd(), envPath)
    : join(process.cwd(), "firebase", "service-account.json");

  if (!existsSync(credentialPath)) return null;

  try {
    return JSON.parse(readFileSync(credentialPath, "utf8")) as ServiceAccount;
  } catch (error) {
    console.warn("Failed to read Firebase service account file:", error);
    return null;
  }
}

function normalizePrivateKey(rawPrivateKey: string) {
  const normalized = rawPrivateKey.replace(/^"|"$/g, "");

  if (normalized.includes("-----BEGIN PRIVATE KEY-----")) {
    return normalized.replace(/\\n/g, "\n");
  }

  try {
    const decoded = Buffer.from(normalized, "base64").toString("utf8");
    if (decoded.includes("-----BEGIN PRIVATE KEY-----")) {
      return decoded;
    }
  } catch {
    // ignore invalid base64 and fall through
  }

  return normalized;
}

function initFirebaseAdmin() {
  const apps = getApps();

  if (!apps.length) {
    const fileCredentials = loadServiceAccountFromFile();
    const projectId =
      process.env.FIREBASE_PROJECT_ID ||
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      (fileCredentials?.projectId as string | undefined);
    const clientEmail =
      process.env.FIREBASE_CLIENT_EMAIL ||
      (fileCredentials?.clientEmail as string | undefined);
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY)
      : (fileCredentials?.privateKey as string | undefined);

    if (fileCredentials?.projectId && fileCredentials?.clientEmail && fileCredentials?.privateKey) {
      initializeApp({
        credential: cert(fileCredentials),
        projectId: fileCredentials.projectId as string,
      });
    } else if (projectId && clientEmail && privateKey) {
      const isValidKey =
        privateKey.includes("-----BEGIN PRIVATE KEY-----") &&
        privateKey.includes("-----END PRIVATE KEY-----");

      if (!isValidKey) {
        console.warn(
          "FIREBASE_PRIVATE_KEY is invalid. Falling back to Application Default Credentials."
        );
        initializeApp({ projectId });
      } else {
        initializeApp({
          credential: cert({ projectId, clientEmail, privateKey }),
          projectId,
        });
      }
    } else if (projectId) {
      initializeApp({ projectId });
    } else {
      initializeApp();
    }
  }

  return {
    auth: getAuth(),
    db: getFirestore(),
  };
}

export const { auth, db } = initFirebaseAdmin();
