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
import {useGetActivities} from '../hooks/useGetActivities.tsx';
import ActivityProgressModel from '../models/Activities/ActivityProgressModel.ts';

const Activities = () => {
  const theme = useTheme();
  const [selectedDay, setSelectedDay] = useState(
    new Date().toISOString().split('T')[0],
  );
  const stubService = new StubService();
  const [activities, setActivities] = useState<ActivityProgressModel[]>([]);
  const [getActivities] = useState(new Date().toISOString().split('T')[1].split('.')[0]);
  const [loading, error] = useGetActivities(selectedDay, getActivities, setActivities,stubService.user);
  const logTimeoutRef = useRef<null | NodeJS.Timeout>(null);

  const handleDaySelect = (day: string) => {
    setActivities([]); // Clear activities before setting the new day
    setSelectedDay(day);

    if (logTimeoutRef.current) {
      clearTimeout(logTimeoutRef.current);
    }

    logTimeoutRef.current = setTimeout(() => {
      console.log(`Selected Day: ${day}`);
    }, 50); // Adjust the delay as needed
  };

  const getCurrentMonth = () => {
    const selectedDate = new Date(selectedDay);
    const options: Intl.DateTimeFormatOptions = {month: 'long'};
    return selectedDate.toLocaleDateString('en-US', options);
  };

  return (
    <SafeAreaView style={[styles.wrapper, {backgroundColor: theme.background}]}>
      <Text style={[styles.monthText, {color: theme.foreground}]}>{getCurrentMonth()}</Text>
      <DayMenu selectedDay={selectedDay} onDaySelect={handleDaySelect} />
      <View>
        <ActivitySection
          title="Morning Activities"
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
