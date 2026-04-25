import { StyleSheet } from 'react-native';

export const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerTitle: {
    color: theme.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearText: {
    color: theme.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 24,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    marginLeft: 16,
  },
  transactionTitle: {
    color: theme.text,
    fontSize: 15,
    fontWeight: 'bold',
  },
  transactionTarget: {
    color: theme.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  boldText: {
    color: theme.text,
    fontWeight: '700',
  },
  dateText: {
    color: theme.textSecondary,
    fontSize: 11,
    marginTop: 4,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountText: {
    color: theme.tintDark,
    fontSize: 16,
    fontWeight: 'bold',
  },
  operatorText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    color: theme.textSecondary,
    fontSize: 16,
    marginTop: 16,
  },
});
