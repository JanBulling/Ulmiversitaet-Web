export type Departure = {
  route: string;
  directionText: string;
  scheduledTime: Date;
  actualTime: Date;
  deviation: number;
  countdown: number;
  vehicleNumber: number;
};

export type PassengerAlert = {
  status?: "DISRUPTION" | "OK";
  timestamp: Date;
  title?: string;
  data?: string[];
};

type PassageStatus =
  | "UPCOMING"
  | "IN-PROGRESS"
  | "ARRIVED"
  | "PASSED"
  | "CANCELLED";
export type Passage = {
  name: string;
  status: PassageStatus;
  scheduledTime: Date;
  actualTime: Date;
  deviation: number;
  countdown: number;
};

export const passageStatusMap: Record<number, PassageStatus> = {
  1: "UPCOMING",
  2: "IN-PROGRESS",
  3: "ARRIVED",
  4: "PASSED",
  5: "CANCELLED",
};
