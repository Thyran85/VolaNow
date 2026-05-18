import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useVibration } from '@/context/VibrationContext';
import { useAppTheme } from '@/context/ThemeContext';
import { OperatorId } from '@/constants/ussd';

interface WithdrawalSuccessProps {
  amount: string;
  cashPoint: string;
  operator: OperatorId;
  agentCode: string;
  onNewTransaction: () => void;
  onBackHome: () => void;
  styles: any;
}

export default function WithdrawalSuccess({
  amount,
  cashPoint,
  operator,
  agentCode,
  onNewTransaction,
  onBackHome,
  styles,
}: WithdrawalSuccessProps) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const { triggerVibration } = useVibration();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 20 }}>
      <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#CCFF0030', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="checkmark-circle" size={56} color="#86D12E" />
      </View>
      <Text style={[styles.headerTitle, { textAlign: 'center' }]}>{t('common.successSent')}</Text>
      <Text style={{ color: theme.textSecondary, textAlign: 'center', fontSize: 14 }}>
        {t('common.amountLabel')} {parseInt(amount).toLocaleString()} {t('common.ar')}{`\n`}{t('common.cashPointLabel')} {cashPoint}{operator === 'airtel' ? `\n${t('withdrawal.agentCodeLabel')} : ${agentCode}` : ''}
      </Text>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: theme.tint, marginTop: 12 }]}
        onPress={() => {
          triggerVibration('light');
          onNewTransaction();
        }}
      >
        <Text style={styles.actionButtonText}>{t('common.newTransaction')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }]}
        onPress={() => { triggerVibration('light'); onBackHome(); }}
      >
        <Text style={[styles.actionButtonText, { color: theme.text }]}>{t('common.backHome')}</Text>
      </TouchableOpacity>
    </View>
  );
}
