export type CoolMode = 'oil' | 'electric' | 'dual';

export type TempZoneType = 'frozen' | 'chilled' | 'ambient';

export type DriveScene = 'loading' | 'waiting' | 'driving' | 'unloading' | 'idle';

export type AlertType = 'temp_rise' | 'idle_too_long' | 'night_noise' | 'fuel_low' | 'battery_low';

export interface TempZone {
  id: string;
  name: string;
  type: TempZoneType;
  targetTemp: number;
  currentTemp: number;
  goods: string;
  goodsWeight: string;
}

export interface FuelBatteryStatus {
  fuelPercent: number;
  fuelRange: number;
  batteryPercent: number;
  batteryRange: number;
  totalRange: number;
}

export interface NextStop {
  name: string;
  address: string;
  eta: string;
  distance: string;
  action: '装货' | '卸货' | '加油' | '充电' | '休息';
}

export interface TripInfo {
  tripId: string;
  orderNo: string;
  startCity: string;
  endCity: string;
  startTime: string;
  totalDistance: string;
  finishedDistance: string;
  progress: number;
  driverName: string;
  plateNo: string;
}

export interface ControlAlert {
  id: string;
  scene: DriveScene;
  sceneLabel: string;
  action: 'switch_oil' | 'switch_electric' | 'switch_dual' | 'keep';
  actionLabel: string;
  description: string;
  executed: boolean;
  executedAt?: string;
  photoUrl?: string;
}

export interface AbnormalAlert {
  id: string;
  type: AlertType;
  typeLabel: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  suggestion: string;
  contactDispatch: boolean;
  handled: boolean;
}

export interface TempDataPoint {
  time: string;
  temp: number;
  zoneId: string;
}

export interface CoolerStatus {
  mode: CoolMode;
  modeLabel: string;
  runningHours: number;
  setTemp: number;
  returnAirTemp: number;
  supplyAirTemp: number;
  evaporatorTemp: number;
  pressureHigh: string;
  pressureLow: string;
}

export interface HandoverRecord {
  id: string;
  handoverTime: string;
  location: string;
  receiverName: string;
  driverSignature?: string;
  receiverSignature?: string;
  tempCurveImage?: string;
  confirmed: boolean;
  remark?: string;
}

export interface TripState {
  tripInfo: TripInfo;
  tempZones: TempZone[];
  fuelBattery: FuelBatteryStatus;
  nextStop: NextStop;
  coolerStatus: CoolerStatus;
  currentScene: DriveScene;
  currentSceneLabel: string;
  controlAlerts: ControlAlert[];
  abnormalAlerts: AbnormalAlert[];
  tempHistory: TempDataPoint[];
  handover: HandoverRecord;
}
