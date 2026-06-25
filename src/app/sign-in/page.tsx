import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";

import GoogleIcon from "@/components/icons/google-icon";
import { Button } from "@/components/ui/button";

const SignInPage = async () => {
  const session = await auth();
  // if (session?.user) redirect("/");

  return (
    <main className="bg-background flex min-h-svh flex-col px-6 py-12">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col p-8">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <Image
            src="/logo.png"
            alt={process.env.NEXT_PUBLIC_APP_NAME ?? "Moving on"}
            width={88}
            height={88}
            className="size-[88px] rounded-[26px] object-contain shadow-[0_14px_30px_-10px_rgba(47,111,98,0.5)]"
            priority
          />
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Moving</h1>
            <h1 className="text-primary text-3xl font-bold">On</h1>
          </div>
          <p className="text-muted-foreground text-base font-light">
            Pack it. Scan it. Forget it.
            <br />
            We&apos;ll remember where everything is.
          </p>
        </div>

        <div className="sticky bottom-0 pb-[max(0rem,env(safe-area-inset-bottom))]">
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <Button variant="outline" type="submit" className="text-base font-bold">
              <GoogleIcon className="size-5" />
              Continue with Google
            </Button>
          </form>
          <p className="text-subtle-foreground mt-4 text-center text-xs font-light tracking-wide">
            By continuing you agree to our{" "}
            <Link href="#" className="underline underline-offset-2">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignInPage;
