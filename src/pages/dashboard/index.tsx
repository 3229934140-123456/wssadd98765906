import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useTrip } from '@/store/TripContext';
import TempZoneCard from '@/components/TempZoneCard';
import FuelBatteryBar from '@/components/FuelBatteryBar';
import { formatTemp, getModeColor } from '@/utils/format';

const DashboardPage: React.FC = () => {
  const { state } = useTrip();
  const { tripInfo, tempZones, fuelBattery, nextStop, coolerStatus, currentSceneLabel } = state;

  const modeIconMap = {
    oil: '🔥',
    electric: '⚡',
    dual: '🔋'
  };

  return (
    <View className={styles.page}>
      <View className={styles.tripCard}>
        <View className={styles.decorBlob} />
        <View className={styles.decorBlob2} />

        <View className={styles.orderRow}>
          <Text className={styles.orderNo}>订单号 {tripInfo.orderNo}</Text>
          <View className={styles.sceneBadge}>🚛 {currentSceneLabel}</View>
        </View>

        <View className={styles.routeRow}>
          <View className={styles.cityBlock}>
            <Text className={styles.cityName}>{tripInfo.startCity}</Text>
            <Text className={styles.timeText}>发车 {tripInfo.startTime.slice(11, 16)}</Text>
          </View>
          <View className={styles.routeConnector}>
            <View className={styles.arrowDot} />
            <View className={styles.arrowLine} />
          </View>
          <View className={styles.cityBlockRight}>
            <Text className={styles.cityName}>{tripInfo.endCity}</Text>
            <Text className={styles.timeText}>预计 {nextStop.eta} 抵达</Text>
          </View>
        </View>

        <View className={styles.progressSection}>
          <View className={styles.progressLabels}>
            <Text className={styles.progressText}>行程进度</Text>
            <Text className={styles.progressValue}>
              {tripInfo.finishedDistance} / {tripInfo.totalDistance}
            </Text>
          </View>
          <View className={styles.progressBarWrap}>
            <View
              className={styles.progressFill}
              style={{ width: `${tripInfo.progress}%` }}
            />
          </View>
        </View>

        <View className={styles.infoGrid}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>司机</Text>
            <Text className={styles.infoValue}>{tripInfo.driverName}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>车牌</Text>
            <Text className={styles.infoValue}>{tripInfo.plateNo}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>完成度</Text>
            <Text className={styles.infoValue} style={{ color: '#00D4AA' }}>{tripInfo.progress}%</Text>
          </View>
        </View>
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.titleText}>📦 温区监控</Text>
        <Text className={styles.titleAction}>{tempZones.length}个温区</Text>
      </View>

      {tempZones.map(zone => (
        <TempZoneCard key={zone.id} zone={zone} />
      ))}

      <View className={styles.sectionTitle}>
        <Text className={styles.titleText}>❄️ 制冷模式</Text>
      </View>

      <View className={styles.modeCard}>
        <View className={styles.modeInfo}>
          <Text className={styles.modeLabel}>当前运行模式</Text>
          <Text
            className={styles.modeValue}
            style={{ color: getModeColor(coolerStatus.mode) }}
          >
            {coolerStatus.modeLabel}
          </Text>
          <View className={styles.modeStats}>
            <View className={styles.modeStat}>
              <Text className={styles.statLabel}>设定温度</Text>
              <Text className={styles.statVal}>{formatTemp(coolerStatus.setTemp)}</Text>
            </View>
            <View className={styles.modeStat}>
              <Text className={styles.statLabel}>回风温度</Text>
              <Text className={styles.statVal}>{formatTemp(coolerStatus.returnAirTemp)}</Text>
            </View>
            <View className={styles.modeStat}>
              <Text className={styles.statLabel}>已运行</Text>
              <Text className={styles.statVal}>{coolerStatus.runningHours}h</Text>
            </View>
          </View>
        </View>
        <View className={classnames(styles.modeIconWrap, {
          [styles.oilMode]: coolerStatus.mode === 'oil',
          [styles.electricMode]: coolerStatus.mode === 'electric',
          [styles.dualMode]: coolerStatus.mode === 'dual'
        })}>
          <Text>{modeIconMap[coolerStatus.mode]}</Text>
        </View>
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.titleText}>⛽ 能源状态</Text>
      </View>

      <FuelBatteryBar status={fuelBattery} />

      <View className={styles.sectionTitle}>
        <Text className={styles.titleText}>📍 下一停车点</Text>
      </View>

      <View className={styles.stopCard}>
        <View className={styles.stopHeader}>
          <View className={styles.stopTitle}>
            <Text className={styles.stopLabel}>目的地</Text>
            <Text className={styles.stopName}>{nextStop.name}</Text>
          </View>
          <View className={styles.etaBadge}>
            <Text className={styles.etaLabel}>预计到达</Text>
            <Text className={styles.etaValue}>{nextStop.eta}</Text>
          </View>
        </View>

        <View className={styles.stopAddress}>
          <Text className={styles.addressIcon}>📍</Text>
          <Text className={styles.addressText}>{nextStop.address}</Text>
        </View>

        <View className={styles.stopFooter}>
          <View className={styles.actionBadge}>
            📦 {nextStop.action}
          </View>
          <Text className={styles.distanceText}>剩余 {nextStop.distance}</Text>
        </View>
      </View>
    </View>
  );
};

export default DashboardPage;
