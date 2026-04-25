import { StyleSheet } from 'react-native';

export const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerTitle: {
    color: theme.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: theme.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 12,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    color: theme.text,
    fontSize: 15,
    fontWeight: '600',
  },
  settingSubtitle: {
    color: theme.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    color: theme.border, // On utilise la couleur de bordure pour un texte discret
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  versionText: {
    color: theme.border,
    fontSize: 10,
    marginTop: 4,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: theme.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  langOptionSelected: {
    backgroundColor: theme.tint + '10',
    borderColor: theme.tint + '30',
  },
  langOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
  // Help Modal Specific
  helpStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    backgroundColor: theme.background,
    padding: 12,
    borderRadius: 16,
  },
  helpStepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  helpStepNumberText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  helpStepText: {
    flex: 1,
    color: theme.text,
    fontSize: 14,
    lineHeight: 20,
  },
  whatsappBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D36620',
    padding: 16,
    borderRadius: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#25D36640',
  },
  whatsappBadgeText: {
    color: '#25D366',
    fontWeight: 'bold',
    marginLeft: 12,
    fontSize: 14,
  },
  // About Modal Specific
  aboutDescription: {
    color: theme.text,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  devCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.background,
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  devInfo: {
    flex: 1,
    marginLeft: 16,
  },
  devName: {
    color: theme.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  devRole: {
    color: theme.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  devLinkIcon: {
    padding: 8,
    backgroundColor: theme.tint + '15',
    borderRadius: 12,
  },
});
