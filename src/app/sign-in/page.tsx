import Image from "next/image";
import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";

import { Button } from "@/components/ui/button";

const SignInPage = async () => {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <main className="bg-background flex min-h-svh items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm p-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Image
            src="/logo2.png"
            alt={process.env.NEXT_PUBLIC_APP_NAME ?? "Moving on"}
            width={160}
            height={160}
            className="size-40 object-contain"
            priority
          />
          <h1 className="text-2xl font-semibold">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
          <p className="text-muted-foreground text-sm">
            Track packed boxes from one home to the next.
          </p>
        </div>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
          className="mt-8"
        >
          <Button variant="outline" type="submit">
            <GoogleIcon className="size-4" aria-hidden />
            Continue with Google
          </Button>
        </form>
      </div>
    </main>
  );
};

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.1A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.44.35-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"
    />
  </svg>
);

export default SignInPage;
