import {Text, View, StyleSheet} from 'react-native';
import React from 'react';
import ActivityProgressModel from '../models/Activities/ActivityProgressModel.ts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'styled-components';

interface ActivityProps {
  activity: ActivityProgressModel;
}

const Activity: React.FC<ActivityProps> = ({activity}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: theme.subViewColor}]}>
      <View style={styles.leftContainer}>
        <Text style={[styles.largeText, {color: theme.foreground}]}>{activity.activityDone.achievement}/{activity.activityDone.activitySave.objective}</Text>
      </View>
      <View style={styles.centerContainer}>
        <Text style={[styles.activityName, {color: theme.foreground}]}>{activity.activityDone.activitySave.activity.name}</Text>
        <View style={styles.weekView}>
          <Text style={[styles.weekInfo, {color: theme.foreground}]}>{activity.weekProgress}%</Text>
          <Text style={[styles.weekInfo, {color: theme.foreground}]}>{activity.weekObjective}/{activity.activityDone.activitySave.frequency}</Text>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <MaterialCommunityIcons name={activity.activityDone.activitySave.activity.icon} size={24} color={theme.foreground} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
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
  weekInfo: {
    fontSize: 16,
  },
  weekView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    paddingTop: 10,
  },
});

export default Activity;
