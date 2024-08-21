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

const Activities = () => {
  const [activities, loading, error] = useGetActivities();
  console.log(activities);
  console.log(loading);
    console.log(error);
  const theme = useTheme();
  const [selectedDay, setSelectedDay] = useState(
    new Date().toISOString().split('T')[0],
  );


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
          activities={sampleActivities}
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
