import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { ControlAlert } from '@/types';

interface ControlAlertBannerProps {
  alert: ControlAlert;
  onExecute: (alertId: string, photoUrl: string) => void;
}

const ControlAlertBanner: React.FC<ControlAlertBannerProps> = ({ alert, onExecute }) => {
  const handleExecute = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 1,
        sourceType: ['camera'],
        sizeType: ['compressed']
      });
      const photoUrl = res.tempFilePaths?.[0];
      if (!photoUrl) {
        console.warn('[ControlAlertBanner] No photo selected');
        Taro.showToast({ title: '请拍摄凭证照片', icon: 'none' });
        return;
      }
      onExecute(alert.id, photoUrl);
      Taro.showToast({ title: '执行成功，已拍照留证', icon: 'success' });
      console.log('[ControlAlertBanner] Photo captured:', photoUrl);
    } catch (err) {
      console.error('[ControlAlertBanner] Photo capture failed or cancelled:', err);
      Taro.showToast({ title: '未拍摄凭证，操作已取消', icon: 'none', duration: 2000 });
    }
  };

  const handlePhotoOnly = async () => {
    Taro.showToast({ title: '请先点击「已执行」按钮', icon: 'none' });
  };

  return (
    <View className={classnames(styles.banner, styles[alert.scene])}>
      <View className={styles.decorCircle} />
      <View className={styles.decorCircle2} />
      <View className={styles.sceneTag}>📍 {alert.sceneLabel}</View>
      <Text className={styles.bigAction}>{alert.actionLabel}</Text>
      <Text className={styles.description}>{alert.description}</Text>

      <View className={styles.actionRow}>
        {alert.executed ? (
          <View className={styles.executedTag}>✓ 已执行 {alert.executedAt?.slice(11, 16)}</View>
        ) : (
          <>
            <Button className={styles.executeBtn} onClick={handleExecute}>
              已执行（拍照）
            </Button>
            <Button className={styles.photoBtn} onClick={handlePhotoOnly}>
              📷
            </Button>
          </>
        )}
      </View>
    </View>
  );
};

export default ControlAlertBanner;
