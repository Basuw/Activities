import React, { useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ActivitySection from '../../components/Activity/ActivitySection';
import DayMenu from '../../components/Activity/DaysMenu';
import StubService from '../../services/stub.ts';
import { useGetActivities } from '../../hooks/useGetActivities.tsx';
import ActivityProgressModel from '../../models/Activities/ActivityProgressModel.ts';
import AddActivitySave from '../../components/Activity/AddActivitySave.tsx';
import UserModel from '../../models/UserModel.ts';

const Activities = (props: { user:UserModel }) => {
  const theme = useTheme();
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().split('T')[0]);
  const stubService = new StubService();
  const [activities, setActivities] = useState<ActivityProgressModel[]>([]);
  const [getActivities] = useState(new Date().toISOString().split('T')[1].split('.')[0]);
  const [loading, error] = useGetActivities(selectedDay, getActivities, setActivities, stubService.user);
  const [isModalVisible, setModalVisible] = useState(false);

  const logTimeoutRef = useRef<null | NodeJS.Timeout>(null);

  const handleDaySelect = (day: string) => {
    if (day === selectedDay) {
      return; // Do nothing if the selected day is the same as the current day
    }

    setActivities([]); // Clear activities before setting the new day
    setSelectedDay(day);

    if (logTimeoutRef.current) {
      clearTimeout(logTimeoutRef.current);
    }

    logTimeoutRef.current = setTimeout(() => {
      console.log(`Selected Day: ${day}`);
    }, 150); // Adjust the delay as needed
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
        <ActivitySection title="Morning Activities" activities={activities} selectedDay={selectedDay}/>
      <TouchableOpacity style={[styles.addActivity,{backgroundColor: theme.purple}]} onPress={toggleModal}>
        <MaterialCommunityIcons name="plus" size={24} color='white' />
      </TouchableOpacity>
      <AddActivitySave isVisible={isModalVisible} onClose={toggleModal} user={props.user}/>
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
