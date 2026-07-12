import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import GoogleIcon from "@/components/icons/google-icon";
import { Button } from "@/components/ui/button";

import { auth, signIn } from "@/auth";

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

const getSafeCallbackUrl = (callbackUrl: string | undefined): string => {
  if (!callbackUrl || !callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) {
    return "/";
  }

  return callbackUrl;
};

const SignInPage = async ({ searchParams }: SignInPageProps) => {
  const session = await auth();
  const { callbackUrl: rawCallbackUrl } = await searchParams;
  const callbackUrl = getSafeCallbackUrl(rawCallbackUrl);

  if (session?.user) {
    if (!session.user.onboardingCompleted && callbackUrl.startsWith("/household/join/")) {
      redirect(callbackUrl);
    }

    redirect(session.user.onboardingCompleted ? callbackUrl || "/" : "/welcome");
  }

  return (
    <main className="bg-background page-content my-8 flex flex-col gap-4">
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
          action={async (formData) => {
            "use server";
            const redirectTo = getSafeCallbackUrl(formData.get("callbackUrl")?.toString());
            await signIn("google", { redirectTo });
          }}
        >
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
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
    </main>
  );
};

export default SignInPage;
