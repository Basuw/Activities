import React, {useState} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import ActivityProgressModel from '../models/Activities/ActivityProgressModel.ts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'styled-components';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useSetProgress } from '../hooks/useSetProgress.tsx';
import ActivityDoneDTO from '../dto/activities/ActivityDoneDTO.tsx';

interface ActivityProps {
  activity: ActivityProgressModel;
  setGetActivities: React.Dispatch<React.SetStateAction<string>>;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onExtraLeftButton1?: () => void;
  onExtraLeftButton2?: () => void;
  onExtraRightButton1?: () => void;
  onExtraRightButton2?: () => void;
}

const Activity: React.FC<ActivityProps> = ({
  activity,
  setGetActivities,
  onSwipeLeft = () => {},
  onSwipeRight = () => {},
  onExtraLeftButton1 = () => {},
  onExtraLeftButton2 = () => {},
  onExtraRightButton1 = () => {},
  onExtraRightButton2 = () => {},
}) => {
  const [activityDoneObject, setActivityDoneObject] = useState(new ActivityDoneDTO(
    activity.activityDone.id,
    activity.activityDone.achievement,
    activity.activityDone.doneOn,
    activity.activityDone.activitySave,
    activity.activityDone.mark,
    activity.activityDone.notes,
    activity.activityDone.status,
    activity.activityDone.duration,
  ));
  const [] = useSetProgress(activityDoneObject,setGetActivities);
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const swipeThreshold = screenWidth * 0.6;
  const handleSwipeLeft = () => {
    console.log('Swiped left');
    onSwipeLeft();
  };

  const handleSwipeRight = () => {
    console.log('Swiped right');
    onSwipeRight();
  };

  const logButtonPress = (message: string, callback: () => void) => {
    console.log(message);
    callback();
  };

  const setDone = () => {
    activity.activityDone.achievement = activity.activityDone.activitySave.objective;
    setActivityDoneObject(activity.activityDone);
  };

  const renderLeftActions = () => (
    <View style={styles.actionContainer}>
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: 'blue' }]} onPress={() => logButtonPress('Extra Left Button 1 Pressed', () => { onExtraLeftButton1();})}>
          <MaterialCommunityIcons name="star" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: 'purple' }]} onPress={() => logButtonPress('Extra Left Button 2 Pressed', () => { onExtraLeftButton2(); })}>
          <MaterialCommunityIcons name="heart" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: 'green' }]} onPress={() => setDone()}>
          <MaterialCommunityIcons name="check" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRightActions = () => (
    <View style={styles.actionContainer}>
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: 'orange' }]} onPress={() => logButtonPress('Extra Right Button 1 Pressed', onExtraRightButton1)}>
          <MaterialCommunityIcons name="alert" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: 'yellow' }]} onPress={() => logButtonPress('Extra Right Button 2 Pressed', onExtraRightButton2)}>
          <MaterialCommunityIcons name="bell" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: 'red' }]} onPress={() => logButtonPress('Right Button Pressed', onSwipeRight)}>
          <MaterialCommunityIcons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleSwipeableOpen = (direction: 'left' | 'right', dragX: number) => {
    if (Math.abs(dragX) >= swipeThreshold) {
      if (direction === 'left') {
        handleSwipeLeft();
      } else if (direction === 'right') {
        handleSwipeRight();
      }
    }
  };

  return (
    <ReanimatedSwipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onSwipeableOpen={(direction: 'left' | 'right', dragX: number) => handleSwipeableOpen(direction, dragX)}
    >
      <View style={[styles.container, { backgroundColor: theme.subViewColor }]}>
        <View style={styles.leftContainer}>
          <Text style={[styles.largeText, { color: theme.foreground }]}>{activityDoneObject.achievement}/{activityDoneObject.activitySave.objective}</Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={[styles.activityName, { color: theme.foreground }]}>{activityDoneObject.activitySave.activity.name}</Text>
          <View style={styles.weekView}>
            <Text style={[styles.weekInfo, { color: theme.foreground }]}>{activity.weekProgress}%</Text>
            <Text style={[styles.weekInfo, { color: theme.foreground }]}>{activity.weekObjective}/{activityDoneObject.activitySave.frequency}</Text>
          </View>
        </View>
        <View style={styles.rightContainer}>
          <MaterialCommunityIcons name={activityDoneObject.activitySave.activity.icon} size={24} color={theme.foreground} />
        </View>
      </View>
    </ReanimatedSwipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden', // Ensure children do not overflow the container
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
  actionContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    borderRadius: 10,
  },
});

export default Activity;
