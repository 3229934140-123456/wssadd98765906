import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useTrip } from '@/store/TripContext';
import TempLineChart from '@/components/TempLineChart';
import { formatTemp, getModeColor } from '@/utils/format';

const HandoverPage: React.FC = () => {
  const { state, setHandoverSignature, confirmHandover } = useTrip();
  const { tripInfo, tempZones, tempHistory, coolerStatus, handover } = state;

  const driverSigned = !!handover.driverSignature;
  const receiverSigned = !!handover.receiverSignature;
  const allSigned = driverSigned && receiverSigned;

  const frozenZone = tempZones.find(z => z.type === 'frozen');

  const handleSign = (role: 'driver' | 'receiver') => {
    const name = role === 'driver' ? tripInfo.driverName : handover.receiverName;
    const roleLabel = role === 'driver' ? '司机' : '收货员';

    Taro.showModal({
      title: `${roleLabel}签名确认`,
      content: `本人${name}确认以上温度数据和冷机状态属实，${role === 'driver' ? '交付' : '接收'}货物无误。签名后不可修改。`,
      confirmText: '确认签名',
      confirmColor: '#00D4AA',
      success: (res) => {
        if (res.confirm) {
          setHandoverSignature(role, name);
          Taro.showToast({ title: '签名成功', icon: 'success' });
          console.log('[HandoverPage] Sign completed:', role, name);
        }
      }
    });
  };

  const handleConfirm = () => {
    if (!allSigned) {
      Taro.showToast({ title: '请双方完成签名', icon: 'none' });
      return;
    }

    Taro.showModal({
      title: '确认交接',
      content: `订单号：${tripInfo.orderNo}\n交接单号：${handover.id}\n\n司机：${handover.driverSignature || tripInfo.driverName}\n收货员：${handover.receiverSignature || handover.receiverName}\n\n确认本次冷链交接完成？此操作不可撤销。`,
      confirmText: '确认交接',
      confirmColor: '#00D4AA',
      success: (res) => {
        if (res.confirm) {
          confirmHandover();
          Taro.showToast({ title: '交接完成 ✓', icon: 'success', duration: 2000 });
          console.log('[HandoverPage] Handover confirmed');
        }
      }
    });
  };

  const handlePreview = () => {
    const avgTemp = frozenZone ? formatTemp(frozenZone.currentTemp) : '--';
    Taro.showModal({
      title: '电子交接凭证',
      content: `交接单号：${handover.id}\n订单号：${tripInfo.orderNo}\n线路：${tripInfo.startCity}→${tripInfo.endCity}\n车牌：${tripInfo.plateNo}\n司机：${handover.driverSignature || '未签'}\n收货员：${handover.receiverSignature || '未签'}\n时间：${handover.handoverTime}\n地点：${handover.location}\n冷冻区温度：${avgTemp}\n状态：${handover.confirmed ? '已完成' : '待确认'}`,
      showCancel: false,
      confirmText: '关闭',
      confirmColor: '#00D4AA'
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.handoverHeader}>
        <View className={styles.headerDecor} />
        <Text className={styles.handoverNo}>交接单号 {handover.id}</Text>
        <Text className={styles.handoverTitle}>冷链交接确认单</Text>
        <View className={styles.headerInfo}>
          <View className={styles.headerInfoItem}>
            <Text className={styles.infoIcon}>🕐</Text>
            <Text className={styles.infoContent}>
              时间 <strong>{handover.handoverTime.slice(0, 16).replace('T', ' ')}</strong>
            </Text>
          </View>
          <View className={styles.headerInfoItem}>
            <Text className={styles.infoIcon}>📍</Text>
            <Text className={styles.infoContent}>
              地点 <strong>{handover.location}</strong>
            </Text>
          </View>
          <View className={styles.headerInfoItem}>
            <Text className={styles.infoIcon}>🚚</Text>
            <Text className={styles.infoContent}>
              车牌 <strong>{tripInfo.plateNo}</strong>
            </Text>
          </View>
        </View>

        {handover.confirmed && (
          <View className={styles.confirmedBanner}>
            <Text className={styles.confirmedIcon}>✅</Text>
            <Text className={styles.confirmedText}>交接已完成 · 凭证已同步调度中心</Text>
          </View>
        )}
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.titleText}>📈 温度曲线数据</Text>
        <View className={styles.titleBadge}>
          {frozenZone ? `${frozenZone.name}实时监控` : ''}
        </View>
      </View>

      {frozenZone && (
        <TempLineChart
          data={tempHistory}
          targetTemp={frozenZone.targetTemp}
          zoneName={frozenZone.name}
        />
      )}

      <View className={styles.sectionTitle}>
        <Text className={styles.titleText}>❄️ 冷机运行参数</Text>
        <View className={styles.titleBadge}>
          {coolerStatus.runningHours}h 运行时长
        </View>
      </View>

      <View className={styles.paramsCard}>
        <View className={styles.paramGrid}>
          <View className={styles.paramItem}>
            <Text className={styles.paramLabel}>运行模式</Text>
            <Text
              className={classnames(styles.paramValue, styles.paramMode)}
              style={{ color: getModeColor(coolerStatus.mode) }}
            >
              {coolerStatus.mode === 'oil' ? '🔥 ' : coolerStatus.mode === 'electric' ? '⚡ ' : '🔋 '}
              {coolerStatus.modeLabel}
            </Text>
          </View>
          <View className={styles.paramItem}>
            <Text className={styles.paramLabel}>设定温度</Text>
            <Text className={classnames(styles.paramValue, styles.paramTemp)}>
              {formatTemp(coolerStatus.setTemp)}
            </Text>
          </View>
          <View className={styles.paramItem}>
            <Text className={styles.paramLabel}>回风温度</Text>
            <Text className={classnames(styles.paramValue, styles.paramTemp)}>
              {formatTemp(coolerStatus.returnAirTemp)}
            </Text>
          </View>
          <View className={styles.paramItem}>
            <Text className={styles.paramLabel}>送风温度</Text>
            <Text className={classnames(styles.paramValue, styles.paramTemp)}>
              {formatTemp(coolerStatus.supplyAirTemp)}
            </Text>
          </View>
          <View className={styles.paramItem}>
            <Text className={styles.paramLabel}>蒸发器温度</Text>
            <Text className={classnames(styles.paramValue, styles.paramTemp)}>
              {formatTemp(coolerStatus.evaporatorTemp)}
            </Text>
          </View>
          <View className={styles.paramItem}>
            <Text className={styles.paramLabel}>系统压力</Text>
            <Text className={classnames(styles.paramValue, styles.paramPress)}>
              {coolerStatus.pressureHigh} / {coolerStatus.pressureLow}
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.titleText}>✍️ 双方签字确认</Text>
        <View
          className={classnames(styles.titleBadge)}
          style={{
            background: allSigned ? 'rgba(0,180,42,0.15)' : 'rgba(245,63,63,0.15)',
            color: allSigned ? '#00B42A' : '#F53F3F'
          }}
        >
          {[driverSigned, receiverSigned].filter(Boolean).length}/2 已签
        </View>
      </View>

      <View className={styles.signSection}>
        <View className={styles.signRow}>
          <View
            className={classnames(styles.signBox, driverSigned && styles.signBoxSigned)}
            onClick={() => !handover.confirmed && !driverSigned && handleSign('driver')}
          >
            <View className={classnames(styles.signRoleBadge, styles.driverBadge)}>
              司机
            </View>
            {driverSigned ? (
              <>
                <Text className={styles.signedText}>{handover.driverSignature}</Text>
                <Text className={styles.signName}>✓ 已确认</Text>
              </>
            ) : (
              <View className={styles.signPlaceholder}>
                <Text className={styles.signIcon}>✍️</Text>
                <Text className={styles.signLabel}>
                  {handover.confirmed ? '已签名' : '点击签名'}
                </Text>
                <Text className={styles.signName}>{tripInfo.driverName}</Text>
              </View>
            )}
          </View>

          <View
            className={classnames(styles.signBox, receiverSigned && styles.signBoxSigned)}
            onClick={() => !handover.confirmed && !receiverSigned && handleSign('receiver')}
          >
            <View className={classnames(styles.signRoleBadge, styles.receiverBadge)}>
              收货员
            </View>
            {receiverSigned ? (
              <>
                <Text className={styles.signedText}>{handover.receiverSignature}</Text>
                <Text className={styles.signName}>✓ 已确认</Text>
              </>
            ) : (
              <View className={styles.signPlaceholder}>
                <Text className={styles.signIcon}>✍️</Text>
                <Text className={styles.signLabel}>
                  {handover.confirmed ? '已签名' : '点击签名'}
                </Text>
                <Text className={styles.signName}>{handover.receiverName}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.titleText}>📝 备注信息</Text>
      </View>

      <View className={styles.remarkBox}>
        <Text className={styles.remarkLabel}>货品完整性说明</Text>
        <View className={styles.remarkContent}>
          三温区温度全程达标，冷冻区平均温度{formatTemp(frozenZone?.currentTemp || -18)}，
          温度偏差在±1℃以内，冷机运行正常，货品外包装完好无损。
        </View>
      </View>

      <View className={styles.footerBar}>
        {handover.confirmed ? (
          <Button className={styles.confirmBtnDisabled} disabled>
            ✓ 交接已完成
          </Button>
        ) : (
          <Button
            className={allSigned ? styles.confirmBtn : styles.confirmBtnDisabled}
            disabled={!allSigned}
            onClick={handleConfirm}
          >
            {allSigned ? '✓ 确认交接完成' : `请完成签名 (${[driverSigned, receiverSigned].filter(Boolean).length}/2)`}
          </Button>
        )}
        <Button className={styles.previewBtn} onClick={handlePreview}>
          📄 预览电子交接凭证
        </Button>
      </View>
    </View>
  );
};

export default HandoverPage;
