"use client";

import { FormFieldType } from "@/components/forms/PatientForm";
import Image from "next/image";
import Link from "next/link";

import { useState } from "react";

import { Form } from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomFormField from "@/components/forms/CustomFormField";
import SubmitButton from "@/components/forms/SubmitButton";
import { LoginFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
// import { createUser } from "@/lib/actions/patient.actions";
import { generateMagicLink } from "@/lib/actions/auth.actions";

const LoginPage = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof LoginFormValidation>>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      email: "",
    },
  });

  // Define a submit handler.
  async function onSubmit({ email }: z.infer<typeof LoginFormValidation>) {
    setIsLoading(true);

    try {
      const response = await generateMagicLink(email);
      router.push(`/login/link-sent`);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  return (
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
              className="space-y-6 flex-1 "
            >
              <section className="mb-12 space-y-4">
                <h1 className="text-2xl font-semibold ">Welcome back...</h1>
              </section>

              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="email"
                label="Email"
                placeholder="johndoe@gmail.com"
                iconSrc="/assets/icons/email.svg"
                iconAlt="email"
              />

              <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
            </form>
          </Form>

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              &#169; 2024 NicaisseHealth
            </p>
            <Link href={"/?admin=true"} className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
