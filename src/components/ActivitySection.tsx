import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Activity from './Activity';
import ActivityProgressModel from "../models/Activities/ActivityProgressModel.ts";

interface ActivitySectionProps {
  title: string;
  activities: ActivityProgressModel[];
}

const ActivitySection: React.FC<ActivitySectionProps> = ({title, activities}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {activities.map((activity) => (
        <Activity key={activity.activityDone.id} activity={activity} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#383838',
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
