import React, { useState, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Animated, PanResponder } from 'react-native';
import ActivityProgressModel from '../models/Activities/ActivityProgressModel.ts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'styled-components';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import ActivityDoneDTO from '../dto/activities/ActivityDoneDTO.tsx';
import { DEV_API_URL } from '@env';
import Slider from '@react-native-community/slider';
import StatusEnum from '../models/Activities/StatusEnum.ts';

interface ActivityProps {
  activity: ActivityProgressModel;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onExtraRightButton1?: () => void;
  onExtraRightButton2?: () => void;
}

const Activity: React.FC<ActivityProps> = ({
  activity,
  onSwipeLeft = () => {},
  onSwipeRight = () => {},
  onExtraRightButton1 = () => {},
  onExtraRightButton2 = () => {},
}) => {
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

  const [slider, setSlider] = useState(activityDoneObject.achievement);
  const animatedValue = useRef(new Animated.Value(slider)).current;
  const sliderWidth = 140;
  const sliderHeight = 40;

  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const swipeThreshold = screenWidth * 0.6;

  const patchActivity = (
    id: number,
    achievement?: number,
    status?: string,
    mark?: number,
    notes?: string,
    duration?: Date
  ) => {
    const url = duration == null ? `${DEV_API_URL}/achieve/${id}?achievement=${achievement}&status=${status}&mark=${mark}&notes=${notes}` : `${DEV_API_URL}/achieve/${id}?achievement=${achievement}&status=${status}&mark=${mark}&notes=${notes}&duration=${duration}`;
    fetch(
        url,
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((responseData) => {
        console.log('GNGNGN', JSON.stringify(responseData));
        setActivityDoneObject(responseData);
      });
  };

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
    patchActivity(
      activity.activityDone.id,
      slider,
      StatusEnum.COMPLETED,
      activity.activityDone.mark,
      activity.activityDone.notes,
      activity.activityDone.duration
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const touchX = evt.nativeEvent.locationX;
        const newValue = Math.round((touchX / sliderWidth) * activityDoneObject.activitySave.objective);
        setSlider(newValue);
        animatedValue.setValue(newValue);
      },
    })
  ).current;

  const renderLeftActions = () => (
    <View style={styles.actionContainer}>
      <View style={styles.buttonGroup}>
        <View
          style={{ width: sliderWidth, height: sliderHeight, justifyContent: 'center' }}
          {...panResponder.panHandlers}
        >
          <Slider
            style={{ width: sliderWidth, height: sliderHeight,paddingTop: 30 }}
            minimumValue={0}
            maximumValue={activityDoneObject.activitySave.objective}
            step={1}
            value={slider}
            onValueChange={(value) => {
              setSlider(value);
              animatedValue.setValue(value);
            }}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
          />
          <Animated.Text
            style={[
              styles.sliderValue,
              {
                transform: [
                  {
                    translateX: animatedValue.interpolate({
                      inputRange: [0, activityDoneObject.activitySave.objective],
                      outputRange: [10, sliderWidth - 25], // Adjust based on slider width
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
              { color: theme.foreground },
            ]}
          >
            {slider}
          </Animated.Text>
        </View>
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
            <Text style={[styles.weekInfo, { color: theme.foreground }]}>
              {Math.round(activity.activityDone.achievement / activity.activityDone.activitySave.objective * 100)}%
            </Text>
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
  sliderValue: {
    position: 'absolute',
    top: 50, // Adjust based on slider height
  },
});

export default Activity;
