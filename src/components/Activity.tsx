import {Text, View, StyleSheet, Image} from 'react-native';
import React from 'react';
import ActivityProgressModel from '../models/Activities/ActivityProgressModel.ts';

interface ActivityProps {
  activity: ActivityProgressModel;
}

const Activity: React.FC<ActivityProps> = ({activity}) => {
  const icon = require('../../assets/icons/activities/running.png');
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Text style={styles.largeText}>{activity.activityDone.achievement}/{activity.activityDone.activitySave.objective}</Text>
      </View>
      <View style={styles.centerContainer}>
        <Text style={styles.activityName}>{activity.activityDone.activitySave.activity.name}</Text>
        <Text>{activity.weekProgress}%</Text>
        <Text>{activity.weekObjective}/{activity.activityDone.activitySave.frequency}</Text>
      </View>
      <View style={styles.rightContainer}>
        <Image
            source={icon} style={styles.icon}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#575757',
    marginTop: 10,
    borderRadius: 10,
  },
  leftContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 2,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  largeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  activityName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  icon: {
    width: 50,
    height: 50,
  },
});

export default Activity;
