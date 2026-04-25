import { StyleSheet } from 'react-native';

export const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    marginBottom: 20,
  },
  titleText: {
    color: theme.text,
    fontSize: 32,
    fontWeight: 'bold',
  },
  welcomeText: {
    color: theme.textSecondary,
    fontSize: 16,
    marginTop: 4,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  actionCard: {
    backgroundColor: theme.surface,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.border,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceTag: {
    color: theme.textSecondary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  cardTitle: {
    color: theme.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  cardDesc: {
    color: theme.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.tint,
    borderRadius: 16,
    paddingVertical: 14,
    gap: 8,
  },
  actionBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
