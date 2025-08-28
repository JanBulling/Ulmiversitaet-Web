export interface PassageData {
  StopNumber: number;
  StopCode: string;
  StopName: string;
  StopPointNumber: number;
  StopPointCode: string;
  PlatformName: string;
  StopPointName: string;
  ArrivalDirectionText: string;
  ArrivalTimeScheduled: string;
  ArrivalTimeActual: string;
  ArrivalCountdown: number;
  ArrivalDeviation: number;
  DepartureDirectionText: string;
  DepartureTimeScheduled: string;
  DepartureTimeActual: string;
  DepartureCountdown: number;
  DepartureDeviation: number;
  Status: number;
  SequenceNumber: number;
}

export enum PassageStatus {
  Upcoming = 1,
  InProgress = 2,
  Arrived = 3,
  Passed = 4,
  Cancelled = 5,
}

export interface VehiclePassage {
  ServiceCategory: string;
  UpdateInterval: string;
  ContentScope: string;
  Range: string;
  VehicleNumber: number;
  VehicleCategory: number;
  RouteNumber: number;
  RouteName: string;
  OrderedBy: string;
  State: string;
  CurrentTimestamp: string;
  PassageData: PassageData[];
}
