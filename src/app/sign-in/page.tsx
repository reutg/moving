import Image from "next/image";
import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";

import GoogleIcon from "@/components/icons/google-icon";
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
            <GoogleIcon className="size-4" />
            Continue with Google
          </Button>
        </form>
      </div>
    </main>
  );
};

export default SignInPage;
