"use client";

import Image from "next/image";

import { useState, useEffect } from "react";

import { Form } from "@/components/ui/form";

import { useForm } from "react-hook-form";
import SubmitButton from "@/components/forms/SubmitButton";
import { useRouter } from "next/navigation";

// import { useSearchParams } from "next/navigation";
import { loginWithMagicLink } from "@/lib/actions/auth.actions";

import { Suspense } from "react";

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [magicLinkSecret, setMagicLinkSecret] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setUserId(searchParams.get("userId"));
    setMagicLinkSecret(searchParams.get("secret"));
  }, []);

  const form = useForm();

  // Define a submit handler.
  async function onSubmit() {
    try {
      setIsLoading(true);
      console.log(userId, magicLinkSecret);
      const response = await loginWithMagicLink(userId!, magicLinkSecret!);
      router.push(`/patients/${userId}/new-appointment`);
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-full min-h-screen h-full flex justify-center items-center">
        <section className="remove-scrollbar container my-auto">
          <div className="sub-container max-w-[496px]">
            <Image
              src={"/assets/icons/logo-full.svg"}
              height={1000}
              width={1000}
              alt="patient - logo"
              className="mb-12 h-10 w-fit"
            />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 flex-1 flex flex-col items-center "
              >
                <section className="mb-12 space-y-1 mt-12">
                  <h1 className="text-4xl font-semibold ">
                    Login Successfully
                  </h1>
                </section>

                <SubmitButton isLoading={isLoading}>
                  Proceed to Appointment
                </SubmitButton>
              </form>
            </Form>

            <div className="text-14-regular mt-20 flex justify-between">
              <p className="justify-items-end text-dark-600 xl:text-left">
                &#169; 2024 NicaisseHealth
              </p>
            </div>
          </div>
        </section>
      </div>
    </Suspense>
  );
};

export default LoginPage;
