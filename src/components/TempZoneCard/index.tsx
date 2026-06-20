import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { TempZone } from '@/types';
import { formatTemp, getTempZoneColor } from '@/utils/format';

interface TempZoneCardProps {
  zone: TempZone;
}

const TempZoneCard: React.FC<TempZoneCardProps> = ({ zone }) => {
  const tempColor = getTempZoneColor(zone.type);
  const tempDiff = zone.currentTemp - zone.targetTemp;
  const isNormal = Math.abs(tempDiff) <= 1;

  return (
    <View className={classnames(styles.card, styles[zone.type])}>
      <View className={styles.header}>
        <View className={styles.headerLeft}>
          <View className={styles.statusDot} style={{ background: isNormal ? '#00B42A' : '#F53F3F' }} />
          <Text className={styles.zoneName}>{zone.name}</Text>
        </View>
        <Text className={styles.goodsInfo}>{zone.goodsWeight}</Text>
      </View>

      <View className={styles.tempRow}>
        <Text
          className={classnames(styles.currentTemp, {
            [styles.frozenTemp]: zone.type === 'frozen',
            [styles.chilledTemp]: zone.type === 'chilled',
            [styles.ambientTemp]: zone.type === 'ambient'
          })}
          style={{ color: tempColor }}
        >
          {formatTemp(zone.currentTemp)}
        </Text>
        <View className={styles.tempDetail}>
          <Text className={styles.targetLabel}>目标温度</Text>
          <Text className={styles.targetValue}>{formatTemp(zone.targetTemp)}</Text>
        </View>
      </View>

      <View className={styles.goodsRow}>
        <Text className={styles.goodsName}>{zone.goods}</Text>
        <Text className={styles.goodsWeight}>
          {isNormal ? '✓ 正常' : `⚠ 偏差${tempDiff > 0 ? '+' : ''}${tempDiff.toFixed(1)}℃`}
        </Text>
      </View>
    </View>
  );
};

export default TempZoneCard;
