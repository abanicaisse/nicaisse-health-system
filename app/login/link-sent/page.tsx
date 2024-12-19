import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="w-full min-h-screen h-full flex flex-col justify-center items-center">
      <Image
        src={"/assets/icons/logo-full.svg"}
        height={1000}
        width={1000}
        alt="patient - logo"
        className="mb-12 h-10 w-fit"
      />
      <section className="mt-2 flex flex-col items-center justify-center">
        <Image
          src={"/assets/icons/success-icon.svg"}
          height={1000}
          width={1000}
          alt="patient - logo"
          className="mb-12 h-50 w-fit"
        />
        <h1 className="text-2xl font-semibold mb-4">Email Sent Successfully</h1>
        <p className="text-dark-700 mb-4">
          Check your email inbox to complete login process
        </p>
        <Button className="shad-primary-btn w-full">
          <Link
            href="https://mail.google.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Gmail
          </Link>
        </Button>
      </section>
    </div>
  );
};

export default LoginPage;
