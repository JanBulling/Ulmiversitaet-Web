"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Input } from "@/ui/input/input";
import { Label } from "@/ui/input/label";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const schema = z.object({
  username: z.string(),
  password: z.string(),
});

type FormData = z.infer<typeof schema>;

// interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const router = useRouter();

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function login(data: FormData) {
    setIsLoading(true);

    const request = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (request.ok) {
      router.push("/admin");
    }
  }

  return (
    <form
      className={cn("space-y-5", className)}
      onSubmit={handleSubmit(login)}
      {...props}
    >
      <div>
        <Label htmlFor="username">Benutzername</Label>
        <Input
          id="username"
          aria-label="username"
          disabled={isLoading}
          type="text"
          {...register("username")}
        />
      </div>
      <div>
        <Label htmlFor="password">Passwort</Label>
        <Input
          id="password"
          aria-label="password"
          disabled={isLoading}
          {...register("password")}
        />
      </div>
      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Log In
      </Button>
    </form>
  );
}
