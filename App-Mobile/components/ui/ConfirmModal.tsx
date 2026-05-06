import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  theme: any;
  confirmText?: string;
  isDestructive?: boolean;
}

export const ConfirmModal = ({ 
  visible, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  theme,
  confirmText,
  isDestructive = true
}: ConfirmModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.iconContainer, { backgroundColor: isDestructive ? '#FF3B3015' : theme.tint + '15' }]}>
            <Feather 
              name={isDestructive ? "alert-triangle" : "help-circle"} 
              size={32} 
              color={isDestructive ? "#FF3B30" : theme.tint} 
            />
          </View>
          
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton, { borderColor: theme.border }]} 
              onPress={onCancel}
            >
              <Text style={[styles.buttonText, { color: theme.text }]}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.confirmButton, { backgroundColor: isDestructive ? '#FF3B30' : theme.tint }]} 
              onPress={onConfirm}
            >
              <Text style={[styles.buttonText, { color: isDestructive ? '#FFF' : '#000' }]}>
                {confirmText || (isDestructive ? t('common.delete') : t('common.confirm'))}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1.5,
  },
  confirmButton: {
    // backgroundColor handled inline
  },
  buttonText: {
    fontWeight: '900',
    fontSize: 16,
  },
});
