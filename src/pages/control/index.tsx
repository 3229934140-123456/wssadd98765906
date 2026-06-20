import React from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useTrip } from '@/store/TripContext';
import { DriveScene } from '@/types';
import ControlAlertBanner from '@/components/ControlAlertBanner';
import AbnormalCard from '@/components/AbnormalCard';

const sceneList: { scene: DriveScene; label: string; icon: string }[] = [
  { scene: 'loading', label: '装货', icon: '📦' },
  { scene: 'waiting', label: '等待', icon: '⏸️' },
  { scene: 'driving', label: '行驶', icon: '🚛' },
  { scene: 'unloading', label: '卸货', icon: '📤' },
  { scene: 'idle', label: '驻车', icon: '🛑' }
];

const ControlPage: React.FC = () => {
  const { state, setScene, executeControl, handleAbnormal } = useTrip();
  const { controlAlerts, abnormalAlerts, currentScene, currentSceneLabel } = state;

  const currentSceneAlerts = controlAlerts.filter(a => a.scene === currentScene);
  const pendingAlerts = currentSceneAlerts.filter(a => !a.executed);
  const doneAlertsCurrentScene = currentSceneAlerts.filter(a => a.executed);

  const allDoneAlerts = controlAlerts.filter(a => a.executed);

  const pendingAbnormals = abnormalAlerts.filter(a => !a.handled);
  const handledAbnormals = abnormalAlerts.filter(a => a.handled);

  const handleSceneChange = (scene: DriveScene) => {
    setScene(scene);
    const label = sceneList.find(s => s.scene === scene)?.label || '';
    Taro.showToast({ title: `已切换至${label}场景`, icon: 'none', duration: 1500 });
  };

  const handleDispatch = () => {
    Taro.showModal({
      title: '紧急联系调度',
      content: '确认拨打调度中心电话 400-888-8888？',
      confirmColor: '#F53F3F',
      success: (res) => {
        if (res.confirm) {
          Taro.makePhoneCall({ phoneNumber: '4008888888' }).catch(err => {
            console.error('[ControlPage] Call failed:', err);
            Taro.showToast({ title: '拨号失败', icon: 'error' });
          });
        }
      }
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.statusHeader}>
        <View className={styles.pulseRing} />
        <View className={styles.headerRow}>
          <View>
            <Text className={styles.statusLabel}>当前场景</Text>
            <Text className={styles.sceneLabelBig}>🚛 {currentSceneLabel}</Text>
          </View>
          <Button className={styles.dispatchBtn} onClick={handleDispatch}>
            📞 紧急调度
          </Button>
        </View>

        <View className={styles.sceneTabs}>
          {sceneList.map(item => (
            <View
              key={item.scene}
              className={classnames(styles.sceneTab, currentScene === item.scene && styles.sceneTabActive)}
              onClick={() => handleSceneChange(item.scene)}
            >
              <Text className={styles.sceneTabIcon}>{item.icon}</Text>
              <Text className={styles.sceneTabText}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View className={styles.statsGrid}>
          <View className={styles.statBox}>
            <Text className={styles.statNum} style={{ color: '#00D4AA' }}>
              {pendingAlerts.length + pendingAbnormals.length}
            </Text>
            <Text className={styles.statDesc}>本场景待处理</Text>
          </View>
          <View className={styles.statBox}>
            <Text className={styles.statNum}>{doneAlertsCurrentScene.length}</Text>
            <Text className={styles.statDesc}>本场景已执行</Text>
          </View>
          <View className={styles.statBox}>
            <Text className={`${styles.statNum} ${pendingAbnormals.length > 0 ? styles.statNumErr : ''}`}>
              {pendingAbnormals.length}
            </Text>
            <Text className={styles.statDesc}>全部异常</Text>
          </View>
        </View>
      </View>

      <View className={styles.tipsBox}>
        <Text className={styles.tipsText}>
          <Text className={styles.tipsBold}>联控操作指引：</Text>
          按下方提示操作冷机后，点击「已执行」按钮并拍摄{' '}
          <Text className={styles.tipsBold}>冷机面板</Text>或{' '}
          <Text className={styles.tipsBold}>仪表</Text>照片作为操作凭证。
          {'\n'}📸 <Text className={styles.tipsBold}>必须拍照留证</Text>，否则操作不计入记录。
        </Text>
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.titleText}>⚡ 本场景联控操作指令</Text>
        <View className={`${styles.titleBadge} ${pendingAlerts.length > 0 ? styles.pendingBadge : styles.doneBadge}`}>
          {pendingAlerts.length > 0 ? `${pendingAlerts.length}项待执行` : '全部已执行'}
        </View>
      </View>

      {pendingAlerts.length > 0 ? (
        pendingAlerts.map(alert => (
          <ControlAlertBanner
            key={alert.id}
            alert={alert}
            onExecute={executeControl}
          />
        ))
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>✅</Text>
          <Text className={styles.emptyText}>
            {currentSceneLabel}场景下无待执行指令
          </Text>
        </View>
      )}

      <View className={styles.sectionTitle}>
        <Text className={styles.titleText}>⚠️ 异常预警</Text>
        <View className={`${styles.titleBadge} ${pendingAbnormals.length > 0 ? styles.pendingBadge : styles.doneBadge}`}>
          {pendingAbnormals.length > 0 ? `${pendingAbnormals.length}项待处理` : '无异常'}
        </View>
      </View>

      {pendingAbnormals.length > 0 ? (
        pendingAbnormals.map(alert => (
          <AbnormalCard
            key={alert.id}
            alert={alert}
            onHandle={handleAbnormal}
          />
        ))
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>🎯</Text>
          <Text className={styles.emptyText}>运行状态良好，暂无异常预警</Text>
        </View>
      )}

      <View className={styles.sectionTitle}>
        <Text className={styles.titleText}>📋 全部执行记录</Text>
        <Text className={styles.titleHint}>共 {allDoneAlerts.length + handledAbnormals.length} 条</Text>
      </View>

      {allDoneAlerts.length > 0 && (
        allDoneAlerts.map(alert => (
          <View key={alert.id} className={styles.historyCard}>
            <View className={styles.historyHeader}>
              <Text className={styles.historyScene}>📍 {alert.sceneLabel}</Text>
              <Text className={styles.historyTime}>
                {alert.executedAt?.slice(0, 16).replace('T', ' ')}
              </Text>
            </View>
            <View className={styles.historyContent}>
              {alert.photoUrl ? (
                <View className={styles.historyPhoto}>
                  <Image className={styles.historyPhotoImg} src={alert.photoUrl} mode="aspectFill" />
                </View>
              ) : (
                <View className={styles.historyPhoto} style={{ background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: '24rpx', color: '#86909C' }}>无凭证</Text>
                </View>
              )}
              <View className={styles.historyInfo}>
                <Text className={styles.historyAction}>✓ {alert.actionLabel}</Text>
                <Text className={styles.historyStatus}>
                  {alert.photoUrl ? '凭证已上传 · 操作完成' : '无照片凭证'}
                </Text>
              </View>
            </View>
          </View>
        ))
      )}

      {handledAbnormals.length > 0 && (
        handledAbnormals.map(alert => (
          <View
            key={alert.id}
            className={styles.historyCard}
            style={{ borderLeftColor: '#00B42A' }}
          >
            <View className={styles.historyHeader}>
              <Text className={styles.historyScene}>⚠️ {alert.typeLabel}</Text>
            </View>
            <View className={styles.historyInfo}>
              <Text className={styles.historyAction}>✓ {alert.title}</Text>
              <Text className={styles.historyStatus}>已按建议处理</Text>
            </View>
          </View>
        ))
      )}

      {allDoneAlerts.length === 0 && handledAbnormals.length === 0 && (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📝</Text>
          <Text className={styles.emptyText}>暂无执行记录</Text>
        </View>
      )}
    </View>
  );
};

export default ControlPage;
