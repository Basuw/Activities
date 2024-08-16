import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Activity from './Activity';
import ActivityModel from '../models/ActivityModel';

interface ActivitySectionProps {
  title: string;
  activities: ActivityModel[];
}

const ActivitySection: React.FC<ActivitySectionProps> = ({title, activities}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {activities.map((activity) => (
        <Activity key={activity.id} activity={activity} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'white',
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ActivitySection;
