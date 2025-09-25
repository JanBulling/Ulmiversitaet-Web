"use client";

import * as React from "react";

import { Button } from "@/ui/button";
import { useRouter } from "next/navigation";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/ui/input/input";
import { Label } from "@/ui/input/label";
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

const schema = z.object({
  summary: z.string().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
  isWholeDay: z.boolean().optional(),
  startDate: z.date(),
  startTime: z.string().optional(),
  endDate: z.date(),
  endTime: z.string().optional(),
  color: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface AddEventFormProps {
  className: string;
}

export default function AddEventForm({ className }: AddEventFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function addEvent(data: FormData) {
    if (!data.isWholeDay) {
      if (!data.startTime || data.startTime.length !== 4) {
        return setError("startTime", { message: "Start time required" });
      }
      if (!data.endTime || data.endTime.length !== 4) {
        return setError("endTime", { message: "End time required" });
      }
    }

    if (data.startDate > data.endDate) {
      return setError("endDate", { message: "End should be after start" });
    }

    setIsLoading(true);

    try {
      const request = await fetch("/api/event", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "content-type": "application/json" },
      });

      if (!request.ok) {
        const errorMessage = await request.text();

        console.error("Etwas ist schief gelaufen", errorMessage);
      } else {
        reset();
        router.refresh();
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Ein unerwarter Fehler ist aufgetreten", error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(addEvent)}
      className={cn(
        "bg-card grid grid-cols-5 gap-4 rounded-md p-4 shadow",
        className,
      )}
    >
      <h2 className="col-span-full text-xl font-semibold">
        Neues Event anlegen
      </h2>
      <div className="col-span-4">
        <Label htmlFor="summary">Event Name</Label>
        <Input
          id="summary"
          aria-label="Summary"
          disabled={isLoading}
          type="text"
          {...register("summary")}
        />
        {errors.summary && (
          <p className="text-destructive text-xs">{errors.summary.message}</p>
        )}
      </div>

      <div className="col-span-full">
        <Label htmlFor="description">Beschreibung</Label>
        <Textarea
          id="description"
          aria-label="Description"
          disabled={isLoading}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-destructive text-xs">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="col-span-3">
        <Label htmlFor="location">Ort / Location</Label>
        <Input
          id="location"
          aria-label="Location"
          disabled={isLoading}
          type="text"
          {...register("location")}
        />
        {errors.location && (
          <p className="text-destructive text-xs">{errors.location.message}</p>
        )}
      </div>

      <div className="col-span-2">
        <Label htmlFor="color">Event Farbe</Label>
        <ColorInput
          id="color"
          aria-label="color"
          disabled={isLoading}
          onChange={(color) => setValue("color", color)}
        />
        {errors.color && (
          <p className="text-destructive text-xs">{errors.color.message}</p>
        )}
      </div>

      <div>
        <div className="flex gap-2">
          <Checkbox
            id="whole-day"
            aria-label="whole day"
            disabled={isLoading}
            onCheckedChange={(checked) =>
              setValue("isWholeDay", checked === true)
            }
          />
          <Label htmlFor="whole-day">Ganzer Tag?</Label>
        </div>
        {errors.isWholeDay && (
          <p className="text-destructive text-xs">
            {errors.isWholeDay.message}
          </p>
        )}
      </div>

      <div className="col-start-1">
        <Label htmlFor="start-date">Start</Label>
        <DateInput
          id="start-date"
          aria-label="start-date"
          onChange={(date) => {
            if (!date) {
              return setError("startDate", {
                message: "Start date is required",
              });
            }
            setValue("startDate", date);
          }}
        />
        {errors.startDate && (
          <p className="text-destructive text-xs">{errors.startDate.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="start-time">Uhrzeit</Label>
        <InputOTP
          maxLength={4}
          pattern={REGEXP_ONLY_DIGITS}
          id="start-time"
          aria-label="start time"
          disabled={isLoading}
          onChange={(val) => setValue("startTime", val)}
        >
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
        {errors.startTime && (
          <p className="text-destructive text-xs">{errors.startTime.message}</p>
        )}
      </div>

      <div className="col-start-1">
        <Label htmlFor="end-date">Ende</Label>
        <DateInput
          id="end-date"
          aria-label="end-date"
          onChange={(date) =>
            date
              ? setValue("endDate", date)
              : setError("endDate", { message: "End date is required" })
          }
        />
        {errors.endDate && (
          <p className="text-destructive text-xs">{errors.endDate.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="end-time">Uhrzeit</Label>
        <InputOTP
          maxLength={4}
          pattern={REGEXP_ONLY_DIGITS}
          id="end-time"
          aria-label="end time"
          disabled={isLoading}
          onChange={(val) => setValue("endTime", val)}
        >
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
        {errors.endTime && (
          <p className="text-destructive text-xs">{errors.endTime.message}</p>
        )}
      </div>

      <p className="text-destructive col-span-full text-xs">
        {errors.root?.message}
      </p>

      <div className="col-span-full">
        <Button type="submit">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Hinzufügen
        </Button>
      </div>
    </form>
  );
}
