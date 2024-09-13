import React, { useState, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import ActivityProgressModel from '../models/Activities/ActivityProgressModel.ts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'styled-components';
import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import ActivityDoneDTO from '../../dto/activities/ActivityDoneDTO.tsx';
import { DEV_API_URL } from '@env';
import StatusEnum from '../../models/Activities/StatusEnum.ts';
import LinearGradient from 'react-native-linear-gradient';

interface ActivityProps {
  activity: ActivityProgressModel;
}

const Activity: React.FC<ActivityProps> = ({ activity }) => {
  const [activityDoneObject, setActivityDoneObject] = useState(
    new ActivityDoneDTO(
      activity.activityDone.id,
      activity.activityDone.achievement,
      activity.activityDone.doneOn,
      activity.activityDone.activitySave,
      activity.activityDone.mark,
      activity.activityDone.notes,
      activity.activityDone.status,
      activity.activityDone.duration
    )
  );

  const theme = useTheme();
  const swipeableRef = useRef<SwipeableMethods | null>(null);
  const velocity = useSharedValue(0);

  function postActivityDone() {
    const url = `${DEV_API_URL}/achieve`;
    const activitySave = activity.activityDone.activitySave;
    console.log('POST');
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        achievement: activityDoneObject.achievement,
        mark: activityDoneObject.mark,
        notes: activityDoneObject.notes,
        activitySave: {
          id: activityDoneObject.activitySave.id,
        },
        status: StatusEnum.COMPLETED,
        duration: activityDoneObject.duration,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('Failed to fetch data');
        }
      })
      .then((responseData) => {
        responseData.activitySave = activitySave;
        setActivityDoneObject(responseData);
      })
      .catch((error) => {
        console.error(error);
      });
    console.log('activityDoneObject', activityDoneObject);
  }

  const patchActivity = (
    id: number,
    achievement?: number,
    status?: string,
    mark?: number,
    notes?: string,
    duration?: Date
  ) => {
    const url =
      duration == null
        ? `${DEV_API_URL}/achieve/${id}?achievement=${achievement}&status=${status}&mark=${mark}&notes=${notes}`
        : `${DEV_API_URL}/achieve/${id}?achievement=${achievement}&status=${status}&mark=${mark}&notes=${notes}&duration=${duration}`;
    const activitySave = activity.activityDone.activitySave;
    console.log('PATCH');
    fetch(url, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        responseData.activitySave = activitySave;
        setActivityDoneObject(responseData);
        console.log('activityDoneObject', activityDoneObject);
      });
  };

  const handleSwipeLeft = () => {
    console.log('Swiped left');
    if (activityDoneObject.achievement !== activityDoneObject.activitySave.objective) {
      activityDoneObject.achievement = activityDoneObject.activitySave.objective;
      updateActivityDone();
    }
  };

  const handleSwipeRight = () => {
    console.log('Swiped right');
  };

  const logButtonPress = (message: string) => {
    console.log(message);
    console.log('activityDoneObject', activityDoneObject);
  };

  const updateActivityDone = () => {
    if (activityDoneObject.id <= 0) {
      postActivityDone();
    }else{
      patchActivity(
          activityDoneObject.id,
          activityDoneObject.achievement,
          StatusEnum.COMPLETED,
          activityDoneObject.mark,
          activityDoneObject.notes,
          activityDoneObject.duration
      );
    }
  };

  const renderLeftActions = () => (
    <LinearGradient
      colors={['#56ab2f', '#a8e063']} // Dégradé de vert clair
      start={{ x: 0, y: 0 }} // Début du dégradé à gauche
      end={{ x: 1, y: 0 }} // Fin du dégradé à droite
      style={styles.leftAction}
    >
      <TouchableOpacity style={styles.actionButton} onPress={() => updateActivityDone()}>
        <MaterialCommunityIcons name="check" size={24} color="white" />
      </TouchableOpacity>
    </LinearGradient>
  );

  const renderRightActions = () => (
    <View style={styles.rightAction}>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: 'orange' }]}
          onPress={() => logButtonPress('Extra Right Button 1 Pressed')}
        >
          <MaterialCommunityIcons name="alert" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: 'yellow' }]}
          onPress={() => logButtonPress('Extra Right Button 2 Pressed')}
        >
          <MaterialCommunityIcons name="bell" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: 'red' }]}
          onPress={() => logButtonPress('Right Button Pressed')}
        >
          <MaterialCommunityIcons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleSwipeableOpen = (direction: 'left' | 'right') => {
    console.log('swipe');
    console.log('direction', direction);
    if (direction === 'left') {
      handleSwipeLeft();
    } else if (direction === 'right') {
      handleSwipeRight();
    }

    // Reset swipeable position after 3 seconds
    setTimeout(() => {
      if (swipeableRef.current) {
        swipeableRef.current.close();
      }
    }, 3000);
  };

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      containerStyle={styles.swipeableContainer}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      rightThreshold={50}
      leftThreshold={100}
      onSwipeableWillOpen={(direction: 'left' | 'right') => handleSwipeableOpen(direction)}
    >
      <View style={[styles.container, { backgroundColor: theme.subViewColor }]}>
        <View style={styles.leftContainer}>
          <Text style={[styles.largeText, { color: theme.foreground }]}>
            {activityDoneObject.achievement}/{activityDoneObject.activitySave.objective}
          </Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={[styles.activityName, { color: theme.foreground }]}>
            {activityDoneObject.activitySave.activity.name}
          </Text>
          <View style={styles.weekView}>
            <Text style={[styles.weekInfo, { color: theme.foreground }]}>
              {Math.round((activity.activityDone.achievement / activity.activityDone.activitySave.objective) * 100)}%
            </Text>
            <Text style={[styles.weekInfo, { color: theme.foreground }]}>
              {activity.weekObjective}/{activityDoneObject.activitySave.frequency}
            </Text>
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
    overflow: 'hidden', // Ensure children do not overflow the container
    padding: 10,
  },
  swipeableContainer: {
    borderRadius: 10,
    marginTop: 10,

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
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
  },
  leftAction: {
    backgroundColor: 'green',
    flexDirection: 'row',
    flex: 1,
  },
  rightAction: {
    backgroundColor: 'red',
    flexDirection: 'row',
  },
});

export default Activity;
