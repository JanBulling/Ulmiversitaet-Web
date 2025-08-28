export type Departure = {
  route: string;
  directionText: string;
  scheduledTime: Date;
  actualTime: Date;
  deviation: number;
  countdown: number;
  vehicleNumber: number;
};

export enum AlertStatus {
  NoResult = "no result found",
  Disruption = "disruption",
  OK = "OK",
  // Add other relevant statuses if known
}

export interface PassengerAlertData {
  UpdateInterval: string;
  CurrentStatus: AlertStatus | string;
  CurrentTimestamp: string;
  AlertTitle?: string;
  AlertData?: string;
}

export interface PassengerAlertResponse {
  PassengerAlert: PassengerAlertData;
}
