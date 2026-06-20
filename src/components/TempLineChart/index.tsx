import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import { TempDataPoint } from '@/types';
import { formatTemp } from '@/utils/format';

interface TempLineChartProps {
  data: TempDataPoint[];
  targetTemp: number;
  zoneName?: string;
}

const TempLineChart: React.FC<TempLineChartProps> = ({ data, targetTemp, zoneName = '冷冻区' }) => {
  const temps = data.map(d => d.temp);
  const minTemp = Math.min(...temps, targetTemp) - 2;
  const maxTemp = Math.max(...temps, targetTemp) + 2;
  const range = maxTemp - minTemp;

  const chartHeight = 280;
  const chartWidth = 570;

  const getY = (temp: number) => {
    return ((maxTemp - temp) / range) * chartHeight;
  };

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * chartWidth;
    const y = getY(d.temp);
    return { x, y, ...d };
  });

  const polylinePath = points.map((p, i) => {
    return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
  }).join(' ');

  const areaPath = `${polylinePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  const targetY = getY(targetTemp);

  const yTicks = [maxTemp, targetTemp, minTemp].map(t => ({
    temp: t,
    y: getY(t)
  }));

  const xTickCount = 5;
  const xTicks = Array.from({ length: xTickCount }, (_, i) => {
    const idx = Math.floor((i * (data.length - 1)) / (xTickCount - 1));
    return data[idx]?.time || '';
  });

  const avgTemp = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
  const maxDeviation = Math.max(...temps.map(t => Math.abs(t - targetTemp))).toFixed(1);
  const normalHours = Math.round(temps.filter(t => Math.abs(t - targetTemp) <= 1).length / 4 * 10) / 10;

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>{zoneName}温度曲线</Text>
        <View className={styles.legend}>
          <View className={styles.legendDot} style={{ background: '#00D4AA' }} />
          <Text>实际温度</Text>
          <View className={styles.legendDot} style={{ background: 'transparent', border: '2rpx dashed #FF7D00' }} />
          <Text>目标温度</Text>
        </View>
      </View>

      <View className={styles.chartArea}>
        <View className={styles.yAxis}>
          {yTicks.map((tick, i) => (
            <Text key={i} className={styles.yLabel} style={{ position: 'absolute', top: tick.y - 12, right: 12 }}>
              {formatTemp(tick.temp)}
            </Text>
          ))}
        </View>

        <View className={styles.chartBody}>
          {[0.25, 0.5, 0.75].map((ratio, i) => (
            <View
              key={i}
              className={styles.gridLine}
              style={{ top: `${ratio * 100}%` }}
            />
          ))}

          <View className={styles.targetLine} style={{ top: targetY }}>
            <Text className={styles.targetLabel}>目标 {formatTemp(targetTemp)}</Text>
          </View>

          <View className={styles.polyline}>
            <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00D4AA" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00D4AA" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#tempGradient)" />
              <path d={polylinePath} fill="none" stroke="#00D4AA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {points.filter((_, i) => i % 4 === 0).map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill="#00D4AA" stroke="#0F172A" strokeWidth="2" />
              ))}
            </svg>
          </View>
        </View>

        <View className={styles.xAxis}>
          {xTicks.map((label, i) => (
            <Text key={i} className={styles.xLabel}>{label}</Text>
          ))}
        </View>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statItem}>
          <Text className={styles.statLabel}>平均温度</Text>
          <Text className={`${styles.statValue} ${styles.coolValue}`}>{formatTemp(parseFloat(avgTemp))}</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statLabel}>最大偏差</Text>
          <Text className={`${styles.statValue} ${styles.warnValue}`}>±{maxDeviation}℃</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statLabel}>达标时长</Text>
          <Text className={`${styles.statValue} ${styles.coolValue}`}>{normalHours}h</Text>
        </View>
      </View>
    </View>
  );
};

export default TempLineChart;
