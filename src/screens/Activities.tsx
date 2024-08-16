import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import ActivitySection from '../components/ActivitySection';
import ActivityModel from '../models/ActivityModel';

const Activities = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [days, setDays] = useState([]);

  useEffect(() => {
    setDays(DaysBeforeAndAfter(startDate, 5));
  }, [startDate]);

  const handleDayClick = (day) => {
    console.log(`Clicked day: ${day.fullDate}`);
  };

  const handleLeftArrowClick = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() - 5);
    setStartDate(newStartDate);
  };

  const handleRightArrowClick = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() + 5);
    setStartDate(newStartDate);
  };

  const getCurrentMonth = () => {
    const options = { month: 'long' };
    return startDate.toLocaleDateString('en-US', options);
  };

  const sampleActivities = [
    new ActivityModel(1, 'Running', 'run-icon', 'km', 'Morning run', 'Fitness', 123),
    new ActivityModel(2, 'Swimming', 'swim-icon', 'laps', 'Evening swim', 'Fitness', 124),
  ];

  return (
    <SafeAreaView style={styles.wrapper}>
      <Text style={styles.monthText}>{getCurrentMonth()}</Text>
      <View style={styles.menu}>
        <TouchableOpacity onPress={handleLeftArrowClick}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        {days.map((day, index) => (
          <TouchableOpacity key={index} style={styles.dayContainer} onPress={() => handleDayClick(day)}>
            <Text style={[styles.dayText, day.fullDate === new Date().toISOString().split('T')[0] && styles.currentDayText]}>
              {day.date}
            </Text>
            <Text style={styles.weekdayText}>{day.weekday}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={handleRightArrowClick}>
          <Feather name="arrow-right" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ActivitySection title="Today's Activities" activities={sampleActivities} />
    </SafeAreaView>
  );
};

const DaysBeforeAndAfter = (startDate, range) => {
  const days = [];
  const options = { weekday: 'short' };
  const halfRange = Math.floor(range / 2);

  for (let i = -halfRange; i <= halfRange; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    days.push({
      date: day.getDate(),
      weekday: day.toLocaleDateString('en-US', options),
      fullDate: day.toISOString().split('T')[0], // Format as YYYY-MM-DD
    });
  }

  return days;
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'lightgrey',
    flex: 1,
  },
  menu: {
    width: '100%',
    height: '10%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayText: {
    fontSize: 24,
    color: 'black',
  },
  currentDayText: {
    color: 'red',
    fontSize: 28,
  },
  weekdayText: {
    fontSize: 16,
    color: 'black',
  },
  monthText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default Activities;
