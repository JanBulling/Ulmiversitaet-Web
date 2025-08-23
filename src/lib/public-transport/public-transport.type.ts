export type Departure = {
  route: string;
  directionText: string;
  scheduledTime: Date;
  actualTime: Date;
  deviation: number;
  countdown: number;
};
