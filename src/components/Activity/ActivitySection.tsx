import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Activity from './Activity';
import ActivityProgressModel from '../../models/Activities/ActivityProgressModel';
import { useTheme } from 'styled-components';

interface ActivitySectionProps {
  title: string;
  activities: ActivityProgressModel[];
  selectedDay: Date;
  fetchActivities: () => void
}

const ActivitySection: React.FC<ActivitySectionProps> = ({ title, activities, selectedDay, fetchActivities}) => {
  const theme = useTheme();

  const renderItem = ({ item }: { item: ActivityProgressModel }) => (
    <Activity
      activity={item}
      selectedDay={selectedDay}
      fetchActivities={fetchActivities}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.viewColor }]}>
      <Text style={[styles.title, { color: theme.foreground }]}>{title}</Text>
      <FlatList
        data={activities}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.activityDone.id}-${item.activityDone.doneOn}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 10,
    borderRadius: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ActivitySection;
