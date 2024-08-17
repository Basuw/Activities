import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import ActivitySection from '../components/ActivitySection';
import ActivityModel from '../models/Activities/ActivityModel';
import DayMenu from '../components/ DaysMenu';

const screenWidth = Dimensions.get('window').width;
const dayWidth = screenWidth / 5;

const Activities = () => {
  const [selectedDay, setSelectedDay] = useState(
    new Date().toISOString().split('T')[0],
  );
  const logTimeoutRef = useRef(null);

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
    const options = {month: 'long'};
    return selectedDate.toLocaleDateString('en-US', options);
  };

  const sampleActivities = [
    new ActivityModel(
      1,
      'Running',
      'run-icon',
      'km',
      'Morning run',
      'Fitness',
      123,
    ),
    new ActivityModel(
      2,
      'Swimming',
      'swim-icon',
      'laps',
      'Evening swim',
      'Fitness',
      124,
    ),
  ];

  return (
    <SafeAreaView style={styles.wrapper}>
      <Text style={styles.monthText}>{getCurrentMonth()}</Text>
      <DayMenu selectedDay={selectedDay} onDaySelect={handleDaySelect} />
      <ActivitySection
        title="Today's Activities"
        activities={sampleActivities}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'lightgrey',
    flex: 1,
  },
  monthText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default Activities;
