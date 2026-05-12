import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'styled-components';
import Icon from '../Icon';
import Activity from './Activity';
import ActivityProgressModel from '../../models/Activities/ActivityProgressModel';

interface ActivitySectionProps {
  activities: ActivityProgressModel[];
  selectedDay: Date;
  loading?: boolean;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({ activities, selectedDay, loading }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.main} />
        <Text style={[styles.loadingText, { color: theme.secondary }]}>Loading…</Text>
      </View>
    );
  }

  if (activities.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.surface }]}>
        <Icon sfSymbol="calendar" androidIcon="calendar-blank" size={48} color={theme.secondary} />
        <Text style={[styles.emptyTitle, { color: theme.foreground }]}>No activities yet</Text>
        <Text style={[styles.emptySubtitle, { color: theme.secondary }]}>
          Tap + to add an activity for this day
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={activities}
      keyExtractor={item => `${item.activityDone.id}-${item.activityDone.doneOn}`}
      renderItem={({ item }) => <Activity activity={item} selectedDay={selectedDay} />}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 24,
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtitle: {
    fontSize: 14,
  },
});

export default ActivitySection;
