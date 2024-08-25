import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Activity from './Activity';
import ActivityProgressModel from '../models/Activities/ActivityProgressModel.ts';
import {useTheme} from 'styled-components';

interface ActivitySectionProps {
  title: string;
  activities: ActivityProgressModel[];
}

const ActivitySection: React.FC<ActivitySectionProps> = ({title, activities}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: theme.viewColor}]}>
      <Text style={[styles.title, {color: theme.foreground}]}>{title}</Text>
      {activities.length > 0 && activities.map((activity) => (
        <Activity key={activity.activityDone.id} activity={activity} />
      ))}
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
