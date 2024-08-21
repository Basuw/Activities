// Update Activities component to ensure activities is always an array
import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text, View,
} from 'react-native';
import ActivitySection from '../components/ActivitySection';
import DayMenu from '../components/DaysMenu';
import StubService from '../services/stub.ts';
import {useTheme} from 'styled-components';
import {useGetActivities} from "../hooks/useGetActivities.tsx";
import ActivitySaveDTO from "../dto/activities/ActivitySaveDTO.tsx";
import ActivityProgressModel from "../models/Activities/ActivityProgressModel.ts";

const Activities = () => {
  const theme = useTheme();
  const [selectedDay, setSelectedDay] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [activities, loading, error]  = useGetActivities(selectedDay);

  console.log('activities', activities);
  console.log('loading', loading);
    console.log('error', error);
  const logTimeoutRef = useRef<null | NodeJS.Timeout>(null);

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);

    if (logTimeoutRef.current) {
      clearTimeout(logTimeoutRef.current);
    }

    logTimeoutRef.current = setTimeout(() => {
      console.log(`Selected Day: ${day}`);
    }, 200); // Adjust the delay as needed
  };

  const getCurrentMonth = () => {
    const selectedDate = new Date(selectedDay);
    const options: Intl.DateTimeFormatOptions = {month: 'long'};
    return selectedDate.toLocaleDateString('en-US', options);
  };

  const stubService = new StubService();
  const sampleActivities = stubService.activitiesProgress;

  return (
    <SafeAreaView style={[styles.wrapper, {backgroundColor: theme.background}]}>
      <Text style={[styles.monthText, {color: theme.foreground}]}>{getCurrentMonth()}</Text>
      <DayMenu selectedDay={selectedDay} onDaySelect={handleDaySelect} />
      <View>
        <ActivitySection
          title="Morning Activities"
            //activities={activities.length > 0 ? new ActivityProgressModel(activities, 80, 2) : []}
            activities={activities}
        />
      </View>
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
  container: {
    justifyContent: 'center',
    flex: 1,
  },
});

export default Activities;
