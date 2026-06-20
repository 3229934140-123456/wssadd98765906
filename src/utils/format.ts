export const formatTemp = (temp: number): string => {
  return temp > 0 ? `+${temp.toFixed(1)}℃` : `${temp.toFixed(1)}℃`;
};

export const formatPercent = (val: number): string => {
  return `${Math.round(val)}%`;
};

export const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
};

export const getSceneBgColor = (scene: string): string => {
  const map: Record<string, string> = {
    loading: '#FFB020',
    waiting: '#FF7D00',
    driving: '#00D4AA',
    unloading: '#4080FF',
    idle: '#64748B'
  };
  return map[scene] || '#64748B';
};

export const getSeverityColor = (severity: string): string => {
  const map: Record<string, string> = {
    high: '#F53F3F',
    medium: '#FF7D00',
    low: '#FFB020'
  };
  return map[severity] || '#FF7D00';
};

export const getTempZoneColor = (type: string): string => {
  const map: Record<string, string> = {
    frozen: '#4080FF',
    chilled: '#00D4AA',
    ambient: '#FFB020'
  };
  return map[type] || '#00D4AA';
};

export const getModeColor = (mode: string): string => {
  const map: Record<string, string> = {
    oil: '#FFB020',
    electric: '#4080FF',
    dual: '#00D4AA'
  };
  return map[mode] || '#00D4AA';
};
