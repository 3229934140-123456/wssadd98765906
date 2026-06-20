import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { AbnormalAlert } from '@/types';
import { getSeverityColor } from '@/utils/format';

interface AbnormalCardProps {
  alert: AbnormalAlert;
  onHandle: (alertId: string) => void;
}

const AbnormalCard: React.FC<AbnormalCardProps> = ({ alert, onHandle }) => {
  const color = getSeverityColor(alert.severity);

  const handleDispatch = () => {
    Taro.showModal({
      title: '联系调度',
      content: '确认拨打调度中心电话 400-888-8888？',
      success: (res) => {
        if (res.confirm) {
          Taro.makePhoneCall({ phoneNumber: '4008888888' }).catch(err => {
            console.error('[AbnormalCard] Call failed:', err);
          });
        }
      }
    });
  };

  return (
    <View className={classnames(
      styles.card,
      styles[alert.severity],
      alert.handled && styles.handled
    )}>
      <View className={styles.header}>
        <View className={styles.typeRow}>
          <View className={classnames(
            styles.severityBadge,
            styles[`${alert.severity}Badge`]
          )} style={{ background: color }}>
            {alert.severity === 'high' ? '紧急' : alert.severity === 'medium' ? '重要' : '提示'}
          </View>
          <Text className={styles.typeLabel}>{alert.typeLabel}</Text>
        </View>
        {alert.handled && <View className={styles.handledBadge}>✓ 已处理</View>}
      </View>

      <Text className={styles.title}>{alert.title}</Text>

      <View className={styles.suggestionBox}>
        <Text className={styles.suggestionLabel}>处理建议</Text>
        <Text className={styles.suggestionText}>{alert.suggestion}</Text>
      </View>

      {!alert.handled && (
        <View className={styles.actionRow}>
          <Button className={styles.handleBtn} onClick={() => onHandle(alert.id)}>
            我已按建议处理
          </Button>
          {alert.contactDispatch && (
            <Button className={styles.dispatchBtn} onClick={handleDispatch}>
              📞 联系调度
            </Button>
          )}
        </View>
      )}
    </View>
  );
};

export default AbnormalCard;
