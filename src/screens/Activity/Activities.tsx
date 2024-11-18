// src/screens/Activity/Activities.tsx
import React, { useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ActivitySection from '../../components/Activity/ActivitySection';
import DayMenu from '../../components/Activity/DaysMenu';
import ActivityProgressModel from '../../models/Activities/ActivityProgressModel.ts';
import SelectActivitySaveModal from '../../components/Activity/AddActivitySave/SelectActivitySaveModal.tsx';
import UserModel from '../../models/UserModel.ts';
import { callApiService } from '../../services/activities/callAPIService.ts';

const Activities = (props: { user: UserModel }) => {
  const theme = useTheme();
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().split('T')[0]);
  const [activities, setActivities] = useState<ActivityProgressModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const idRef = useRef(-1);

  const logTimeoutRef = useRef<null | NodeJS.Timeout>(null);

  const handleDaySelect = (day: string) => {
    if (day === selectedDay) {
      return; // Do nothing if the selected day is the same as the current day
    }

    if (logTimeoutRef.current) {
      clearTimeout(logTimeoutRef.current);
    }

    logTimeoutRef.current = setTimeout(() => {
      setSelectedDay(day);
      console.log(`Selected Day: ${selectedDay}`);
      fetchActivities();
    }, 150); // Adjust the delay as needed
  };

  const fetchActivities = () => {
    setLoading(true);
    setActivities([]); // Clear activities before setting the new day
    callApiService.fetchActivitiesDone(selectedDay, props.user.id)
      .then((fetchedActivities) => {
        setActivities(fetchedActivities);
      })
      .catch((error) => {
        console.log('An error occurred while fetching data', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getCurrentMonth = () => {
    const selectedDate = new Date(selectedDay);
    const options: Intl.DateTimeFormatOptions = { month: 'long' };
    return selectedDate.toLocaleDateString('en-US', options);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <SafeAreaView style={[styles.wrapper, { backgroundColor: theme.background }]}>
      <Text style={[styles.monthText, { color: theme.foreground }]}>{getCurrentMonth()}</Text>
      <DayMenu selectedDay={selectedDay} onDaySelect={handleDaySelect} />
      <ActivitySection title="Morning Activities" activities={activities} selectedDay={selectedDay} fetchActivities={fetchActivities} />
      <TouchableOpacity style={[styles.addActivity, { backgroundColor: theme.purple }]} onPress={toggleModal}>
        <MaterialCommunityIcons name="plus" size={24} color='white' />
      </TouchableOpacity>
      <SelectActivitySaveModal isVisible={isModalVisible} onClose={toggleModal} user={props.user} fetchActivitiesDone={fetchActivities} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  monthText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  addActivity: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure FAB is above other content
  },
});

export default Activities;
