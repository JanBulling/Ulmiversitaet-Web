"use client";

import * as React from "react";

import { Button } from "@/ui/button";
import { useRouter } from "next/navigation";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/ui/input/input";
import { Loader2 } from "lucide-react";
import { ColorInput } from "@/ui/input/color-picker/color-input";
import { cn } from "@/lib/utils";
import { Textarea } from "@/ui/input/text-area";
import { DateInput } from "@/ui/input/date-input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/ui/input/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Checkbox } from "@/ui/input/check-box";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";

const schema = z.object({
  summary: z.string({ message: "Der Event-Titel wird benötigt" }).min(1, {
    message: "Der Event-Titel wird benötigt",
  }),
  description: z.string().optional(),
  location: z.string().optional(),
  isWholeDay: z.boolean().optional(),
  startDate: z.date({ message: "Ein Start-Datum wird benötigt" }),
  startTime: z.string().optional(),
  endDate: z.date({ message: "Ein End-Datum wird benötigt" }),
  endTime: z.string().optional(),
  color: z.string().optional(),
});

interface AddEventFormProps {
  className: string;
}

export default function AddEventForm({ className }: AddEventFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    if (!values.isWholeDay) {
      if (!values.startTime || values.startTime.length !== 4) {
        return form.setError("startTime", {
          message: "Start-Zeit wird benötigt",
        });
      }
      if (!values.endTime || values.endTime.length !== 4) {
        return form.setError("endTime", { message: "End-Zeit wird benötigt" });
      }
    }

    if (values.startDate > values.endDate) {
      return form.setError("endDate", {
        message: "End-Datum muss nach dem Start-Datum liegen",
      });
    }

    setIsLoading(true);

    try {
      const request = await fetch("/api/event", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "content-type": "application/json" },
      });

      if (!request.ok) {
        const errorMessage = await request.text();

        form.setError("root", {
          message: "Ein unerwarteter Fehler ist Aufgetreten: " + errorMessage,
        });
      } else {
        router.refresh();
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      form.setError("root", {
        message: "Ein unerwarteter Fehler ist Aufgetreten",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "bg-card grid grid-cols-1 gap-4 rounded-md border p-4 shadow md:grid-cols-3",
          className,
        )}
      >
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Event Titel</FormLabel>
              <FormControl>
                <Input placeholder="Titel des Events" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="md:col-span-full">
              <FormLabel>Event Beschreibung</FormLabel>
              <FormControl>
                <Textarea placeholder="Beschreibung des Events" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Ort / Location</FormLabel>
              <FormControl>
                <Input placeholder="Ort des Events" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="md:col-span-1">
              <FormLabel>Farbe</FormLabel>
              <FormControl>
                <ColorInput
                  initial="#fa5252"
                  {...field}
                  swatches={[
                    "#2e2e2e",
                    "#868e96",
                    "#fa5252",
                    "#e64980",
                    "#be4bdb",
                    "#7950f2",
                    "#4c6ef5",
                    "#228be6",
                    "#15aabf",
                    "#12b886",
                    "#40c057",
                    "#82c91e",
                    "#fab005",
                    "#fd7e14",
                  ]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isWholeDay"
          render={({ field }) => (
            <FormItem className="mt-8 flex flex-row items-center gap-2 md:col-span-full">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Ganzer Tag?</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="md:col-span-2 md:col-start-1">
              <FormLabel>Start-Datum</FormLabel>
              <FormControl>
                <DateInput
                  value={field.value}
                  onChange={(date) => {
                    field.onChange(date);
                    form.setValue("endDate", date ?? new Date());
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem className="md:col-span-1">
              <FormLabel>Start-Uhrzeit</FormLabel>
              <FormControl>
                <InputOTP maxLength={4} pattern={REGEXP_ONLY_DIGITS} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="md:col-span-2 md:col-start-1">
              <FormLabel>End-Datum</FormLabel>
              <FormControl>
                <DateInput value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem className="md:col-span-1">
              <FormLabel>End-Uhrzeit</FormLabel>
              <FormControl>
                <InputOTP maxLength={4} pattern={REGEXP_ONLY_DIGITS} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <p className="text-destructive col-span-full col-start-1 line-clamp-1 text-sm">
          {form.formState?.errors?.root?.message}
        </p>

        <div className="md:col-span-full">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Hinzufügen
          </Button>
        </div>
      </form>
    </Form>
  );
}
