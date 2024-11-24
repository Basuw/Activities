import React, { useState, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import ActivityProgressModel from '../../models/Activities/ActivityProgressModel.ts';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'styled-components';
import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import ActivityDoneDTO from '../../dto/activities/ActivityDoneDTO.tsx';
import LinearGradient from 'react-native-linear-gradient';
import ActivityDoneEditModal from './EditActivityDone/ActivityDoneEditModal.tsx';
import { callApiService } from '../../services/activities/callAPIService.ts';

interface ActivityProps {
  activity: ActivityProgressModel;
  selectedDay: Date;
}

const Activity: React.FC<ActivityProps> = ({ activity, selectedDay }) => {
  const [activityProgressModel, setActivityProgressModel] = useState(activity);

  const theme = useTheme();
  const swipeableRef = useRef<SwipeableMethods | null>(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);

  const handleEditPress = () => {
    setEditModalVisible(true);
  };

  const handleSave = (updatedActivity: ActivityDoneDTO) => {
    activityProgressModel.activityDone = updatedActivity;
    createOrUpdateActivityDone(activityProgressModel.activityDone);
  };

  const handleSwipeRight = () => {
    console.log('Swiped right');
    if (activityProgressModel.activityDone.achievement !== activityProgressModel.activityDone.activitySave.objective) {
      activityProgressModel.activityDone.achievement = activityProgressModel.activityDone.activitySave.objective;
      createOrUpdateActivityDone(activityProgressModel.activityDone);
    }
  };

  const handleSwipeLeft = () => {
    console.log('Swiped left');
    // Ajoutez ici la logique pour le swipe à droite si nécessaire
  };

  const createOrUpdateActivityDone = async (updatedActivity: ActivityDoneDTO) => {
    activityProgressModel.activityDone.doneOn = selectedDay;
    if (activityProgressModel.activityDone.id <= 0) {
      try {
        const result = await callApiService.postActivityDone(updatedActivity);
        setActivityProgressModel(result);
      } catch (error) {
        console.error('Error posting activity:', error);
      }
    } else {
      try {
        const result = await callApiService.patchActivityDone(updatedActivity);
        setActivityProgressModel(result);
      } catch (error) {
        console.error('Error posting activity:', error);
      }
    }
  };

  const renderLeftActions = () => (
    <LinearGradient
      colors={['#56ab2f', '#a8e063']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.leftAction}
    >
      <TouchableOpacity style={styles.actionButton} onPress={() => createOrUpdateActivityDone(activityProgressModel.activityDone)}>
        <MaterialCommunityIcons name="check" size={24} color="white" />
      </TouchableOpacity>
    </LinearGradient>
  );

  const renderRightActions = () => (
    <View style={styles.rightAction}>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: 'orange' }]}
          onPress={() => console.log('Extra Right Button 1 Pressed')}
        >
          <MaterialCommunityIcons name="alert" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: 'yellow' }]}
          onPress={() => console.log('Extra Right Button 2 Pressed')}
        >
          <MaterialCommunityIcons name="bell" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: 'red' }]}
          onPress={() => console.log('Right Button Pressed')}
        >
          <MaterialCommunityIcons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleSwipeableOpen = (direction: 'left' | 'right') => {
    console.log(`Swipeable opened in direction: ${direction}`);
    if (direction === 'left') {
      handleSwipeLeft();
    } else if (direction === 'right') {
      handleSwipeRight();
    }

    setTimeout(() => {
      if (swipeableRef.current) {
        swipeableRef.current.close();
      }
    }, 3000);
  };

  return (
    <View>
      <TouchableOpacity onPress={handleEditPress}>
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
                {activityProgressModel.activityDone.achievement}/{activityProgressModel.activityDone.activitySave.objective}
              </Text>
            </View>
            <View style={styles.centerContainer}>
              <Text style={[styles.activityName, { color: theme.foreground }]}>
                {activityProgressModel.activityDone.activitySave.activity.name}
              </Text>
              <View style={styles.weekView}>
                <Text style={[styles.weekInfo, { color: theme.foreground }]}>
                  {Math.round((activity.activityDone.achievement / activity.activityDone.activitySave.objective) * 100)}%
                </Text>
                <Text style={[styles.weekInfo, { color: theme.foreground }]}>
                  {activity.weekObjective}/{activityProgressModel.activityDone.activitySave.frequency}
                </Text>
              </View>
            </View>
            <View style={styles.rightContainer}>
              <MaterialCommunityIcons name={activityProgressModel.activityDone.activitySave.activity.icon} size={24} color={theme.foreground} />
            </View>
          </View>
        </ReanimatedSwipeable>
      </TouchableOpacity>
      <ActivityDoneEditModal
        isVisible={isEditModalVisible}
        activity={activityProgressModel.activityDone}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSave}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    overflow: 'hidden',
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
