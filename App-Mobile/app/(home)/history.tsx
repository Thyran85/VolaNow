import React from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useHistory, HistoryItem } from '@/context/HistoryContext';
import { useAppTheme } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useVibration } from '@/context/VibrationContext';
import { createStyles } from '@/styles/history.styles';

export default function HistoryPage() {
  const { history, removeHistoryItem, clearHistory } = useHistory();
  const { theme, isDark } = useAppTheme();
  const { triggerVibration } = useVibration();
  const { t, i18n } = useTranslation();
  const styles = createStyles(theme);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDeleteItem = (id: string) => {
    triggerVibration('warning');
    Alert.alert(
      t('common.confirm'),
      t('history.confirmDeleteOne'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.delete'), style: 'destructive', onPress: () => removeHistoryItem(id) }
      ]
    );
  };

  const handleClearHistory = () => {
    triggerVibration('warning');
    Alert.alert(
      t('common.confirm'),
      t('history.confirmDeleteAll'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.deleteAll'), style: 'destructive', onPress: () => clearHistory() }
      ]
    );
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.historyCard}>
      <View style={[styles.iconContainer, { backgroundColor: item.type === 'withdrawal' ? (isDark ? '#CCFF0022' : '#B0FC5144') : (isDark ? '#B0FC5122' : '#86D12E44') }]}>
        <Feather 
          name={item.type === 'withdrawal' ? 'arrow-down-left' : 'repeat'} 
          size={20} 
          color={item.type === 'withdrawal' ? theme.tint : theme.tintDark} 
        />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.transactionTitle}>
          {item.type === 'withdrawal' ? t('history.withdrawal') : t('history.transfer')}
        </Text>
        <Text style={styles.transactionTarget}>
          {item.type === 'withdrawal' ? t('history.targetWithdrawal') : t('history.targetTransfer')}
          <Text style={styles.boldText}>{item.target}</Text>
        </Text>
        <Text style={styles.dateText}>{formatDate(item.date)}</Text>
      </View>
      
      <View style={styles.amountContainer}>
        <Text style={styles.amountText}>{parseInt(item.amount).toLocaleString()} {t('common.ar')}</Text>
        <Text style={[styles.operatorText, { color: getOperatorColor(item.operator) }]}>
          {item.operator.toUpperCase()}
        </Text>
        <TouchableOpacity 
          onPress={() => handleDeleteItem(item.id)}
          style={{ padding: 4, marginTop: 4, alignSelf: 'flex-end' }}
        >
          <Feather name="trash-2" size={16} color="#FF3B30" opacity={0.6} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const getOperatorColor = (op: string) => {
    switch (op) {
      case 'mvola': return '#E60000';
      case 'orange': return '#FF7900';
      case 'airtel': return '#ED1C24';
      default: return theme.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('history.title')}</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearHistory}>
            <Text style={styles.clearText}>{t('history.clear')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="clock" size={64} color={isDark ? "#222" : "#DDD"} />
          <Text style={styles.emptyText}>{t('history.empty')}</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
