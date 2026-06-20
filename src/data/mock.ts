import {
  TripState,
  TripInfo,
  TempZone,
  FuelBatteryStatus,
  NextStop,
  CoolerStatus,
  ControlAlert,
  AbnormalAlert,
  TempDataPoint,
  HandoverRecord
} from '@/types';

export const mockTripInfo: TripInfo = {
  tripId: 'TRIP20260621001',
  orderNo: 'COLD-2026-0621-889',
  startCity: '上海',
  endCity: '杭州',
  startTime: '2026-06-21 06:30:00',
  totalDistance: '186 km',
  finishedDistance: '142 km',
  progress: 76,
  driverName: '张建国',
  plateNo: '沪A·8896冷链'
};

export const mockTempZones: TempZone[] = [
  {
    id: 'zone1',
    name: '冷冻区',
    type: 'frozen',
    targetTemp: -18,
    currentTemp: -17.8,
    goods: '进口牛排、速冻水饺',
    goodsWeight: '3.2吨'
  },
  {
    id: 'zone2',
    name: '冷藏区',
    type: 'chilled',
    targetTemp: 4,
    currentTemp: 4.2,
    goods: '鲜奶、酸奶、鲜切水果',
    goodsWeight: '1.8吨'
  },
  {
    id: 'zone3',
    name: '常温区',
    type: 'ambient',
    targetTemp: 20,
    currentTemp: 19.5,
    goods: '干货、包装食品',
    goodsWeight: '0.6吨'
  }
];

export const mockFuelBattery: FuelBatteryStatus = {
  fuelPercent: 68,
  fuelRange: 420,
  batteryPercent: 45,
  batteryRange: 180,
  totalRange: 600
};

export const mockNextStop: NextStop = {
  name: '杭州农副产品物流中心',
  address: '杭州市余杭区博园路1号',
  eta: '09:45',
  distance: '44 km',
  action: '卸货'
};

export const mockCoolerStatus: CoolerStatus = {
  mode: 'electric',
  modeLabel: '电机制冷',
  runningHours: 3.2,
  setTemp: -18,
  returnAirTemp: -17.5,
  supplyAirTemp: -22.1,
  evaporatorTemp: -25.3,
  pressureHigh: '1.8 MPa',
  pressureLow: '0.3 MPa'
};

export const mockControlAlerts: ControlAlert[] = [
  {
    id: 'ctrl_load1',
    scene: 'loading',
    sceneLabel: '装货作业中',
    action: 'switch_oil',
    actionLabel: '启动油机预冷',
    description: '装货前需启动柴机油机提前预冷厢体，确保装货时温度已降至目标温区，避免货品入厢后升温',
    executed: false
  },
  {
    id: 'ctrl_load2',
    scene: 'loading',
    sceneLabel: '装货作业中',
    action: 'keep',
    actionLabel: '装货完毕关门前复检',
    description: '装货完成后关闭厢门前，确认冷机运行正常、厢内温度达标后再关门，并拍照留证',
    executed: false
  },
  {
    id: 'ctrl1',
    scene: 'driving',
    sceneLabel: '高速行驶中',
    action: 'keep',
    actionLabel: '保持当前模式',
    description: '当前电机制冷运行正常，续航充足，继续保持电机模式',
    executed: true,
    executedAt: '2026-06-21 07:15:00',
    photoUrl: 'https://picsum.photos/id/2/400/300'
  },
  {
    id: 'ctrl_drive2',
    scene: 'driving',
    sceneLabel: '高速行驶中',
    action: 'switch_dual',
    actionLabel: '切换油电双模强冷',
    description: '环境温度较高，单电机制冷能力不足，请启动油电双模式强冷快速降温',
    executed: false
  },
  {
    id: 'ctrl2',
    scene: 'waiting',
    sceneLabel: '服务区等待',
    action: 'switch_oil',
    actionLabel: '切换至油机强冷',
    description: '怠速等待超过10分钟，电池消耗较快，请启动柴机油机进行强冷，节省电池续航',
    executed: false
  },
  {
    id: 'ctrl_wait2',
    scene: 'waiting',
    sceneLabel: '服务区等待',
    action: 'keep',
    actionLabel: '保持油机运行',
    description: '等待期间保持油机制冷，确保厢内温度稳定，等待结束后再切回电机',
    executed: false
  },
  {
    id: 'ctrl3',
    scene: 'unloading',
    sceneLabel: '卸货作业中',
    action: 'switch_electric',
    actionLabel: '切换至电机制冷',
    description: '市区内卸货请使用电机模式，避免柴机油机噪音扰民，遵守市区禁噪规定',
    executed: false
  },
  {
    id: 'ctrl_unload2',
    scene: 'unloading',
    sceneLabel: '卸货作业中',
    action: 'keep',
    actionLabel: '开门前确认温度达标',
    description: '卸货开门前确认各温区温度在目标范围内，开门后尽快卸货减少冷气流失',
    executed: false
  }
];

export const mockAbnormalAlerts: AbnormalAlert[] = [
  {
    id: 'abn1',
    type: 'temp_rise',
    typeLabel: '温度回升',
    severity: 'high',
    title: '冷冻区温度回升至-17.2℃',
    suggestion: '立即关闭厢门，检查密封条，启动油机强冷10分钟后复检',
    contactDispatch: false,
    handled: false
  },
  {
    id: 'abn2',
    type: 'night_noise',
    typeLabel: '夜间禁噪',
    severity: 'low',
    title: '进入市区夜间禁噪区域',
    suggestion: '切换至纯电机制冷模式，禁止启动柴机油机',
    contactDispatch: false,
    handled: false
  }
];

export const generateTempHistory = (): TempDataPoint[] => {
  const history: TempDataPoint[] = [];
  const now = new Date('2026-06-21T09:00:00');
  for (let i = 24; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 15 * 60 * 1000);
    const h = t.getHours();
    const m = t.getMinutes().toString().padStart(2, '0');
    const baseTemp = -18 + Math.sin(i * 0.3) * 0.8 + (i > 18 ? 0.5 : 0);
    history.push({
      time: `${h}:${m}`,
      temp: parseFloat(baseTemp.toFixed(1)),
      zoneId: 'zone1'
    });
  }
  return history;
};

export const mockTempHistory = generateTempHistory();

export const mockHandover: HandoverRecord = {
  id: 'HO20260621001',
  handoverTime: '2026-06-21 09:45:00',
  location: '杭州农副产品物流中心3号冷库',
  receiverName: '李明华',
  confirmed: false
};

export const mockTripState: TripState = {
  tripInfo: mockTripInfo,
  tempZones: mockTempZones,
  fuelBattery: mockFuelBattery,
  nextStop: mockNextStop,
  coolerStatus: mockCoolerStatus,
  currentScene: 'driving',
  currentSceneLabel: '高速行驶中',
  controlAlerts: mockControlAlerts,
  abnormalAlerts: mockAbnormalAlerts,
  tempHistory: mockTempHistory,
  handover: mockHandover
};
