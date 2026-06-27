import Link from "next/link";

const FIRESTORE_SETUP_URL =
  "https://console.firebase.google.com/project/ai-interview-prep-f1756/firestore";

const FirestoreSetupBanner = () => {
  return (
    <div className="rounded-2xl border border-primary-200/30 bg-primary-200/10 p-5 flex flex-col gap-3">
      <p className="font-semibold text-primary-100">
        One-time setup required: Enable Firestore
      </p>
      <p className="text-sm text-light-400">
        Your Firebase project needs a Firestore database before interviews can be
        saved. This takes about 30 seconds.
      </p>
      <Link
        href={FIRESTORE_SETUP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-bold text-primary-200 hover:underline w-fit"
      >
        Open Firebase Console → Create Database
      </Link>
    </div>
  );
};

export default FirestoreSetupBanner;
