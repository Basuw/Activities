import {Text, View, StyleSheet} from 'react-native';
import React from 'react';
import ActivityModel from '../models/ActivityModel';

interface ActivityProps {
  activity: ActivityModel;
}

const Activity: React.FC<ActivityProps> = ({activity}) => {
  return (
    <View style={styles.container}>
      <Text>ID: {activity.id}</Text>
      <Text>Name: {activity.name}</Text>
      <Text>Icon: {activity.icon}</Text>
      <Text>Unity: {activity.unity}</Text>
      <Text>Description: {activity.description}</Text>
      <Text>Category: {activity.category}</Text>
      <Text>User ID: {activity.userid}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'white',
    marginTop: 10,
  },
});

export default Activity;
