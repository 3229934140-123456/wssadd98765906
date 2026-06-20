import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { FuelBatteryStatus } from '@/types';

interface FuelBatteryBarProps {
  status: FuelBatteryStatus;
}

const FuelBatteryBar: React.FC<FuelBatteryBarProps> = ({ status }) => {
  return (
    <View className={styles.container}>
      <View className={styles.titleRow}>
        <Text className={styles.title}>油电状态</Text>
        <Text className={styles.totalRange}>综合续航 {status.totalRange} km</Text>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <View className={styles.labelRow}>
            <View className={classnames(styles.iconBox, styles.oilIcon)}>
              <Text>⛽</Text>
            </View>
            <Text className={styles.label}>燃油</Text>
          </View>
          <Text className={styles.percentText} style={{ color: '#FFB020' }}>
            {Math.round(status.fuelPercent)}%
          </Text>
        </View>
        <View className={styles.progressBar}>
          <View
            className={classnames(styles.progressFill, styles.oilFill)}
            style={{ width: `${status.fuelPercent}%` }}
          />
        </View>
        <View className={styles.rangeRow}>
          <Text className={styles.rangeText}>续航 {status.fuelRange} km</Text>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <View className={styles.labelRow}>
            <View className={classnames(styles.iconBox, styles.batteryIcon)}>
              <Text>🔋</Text>
            </View>
            <Text className={styles.label}>电池</Text>
          </View>
          <Text className={styles.percentText} style={{ color: '#4080FF' }}>
            {Math.round(status.batteryPercent)}%
          </Text>
        </View>
        <View className={styles.progressBar}>
          <View
            className={classnames(styles.progressFill, styles.batteryFill)}
            style={{ width: `${status.batteryPercent}%` }}
          />
        </View>
        <View className={styles.rangeRow}>
          <Text className={styles.rangeText}>续航 {status.batteryRange} km</Text>
        </View>
      </View>
    </View>
  );
};

export default FuelBatteryBar;
