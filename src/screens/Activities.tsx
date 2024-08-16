import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import ActivitySection from '../components/ActivitySection';
import ActivityModel from '../models/ActivityModel';

const screenWidth = Dimensions.get('window').width;

const Activities = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().split('T')[0]);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const generatedDays = DaysBeforeAndAfter(startDate);
    setDays(generatedDays);
    // Center the current day on initialization
    setTimeout(() => {
      if (scrollViewRef.current) {
        const currentDayIndex = generatedDays.findIndex(day => day.fullDate === selectedDay);
        scrollViewRef.current.scrollTo({ x: currentDayIndex * 60 - screenWidth / 2 + 30, animated: true });
      }
    }, 100);
  }, [startDate]);

  const handleDayClick = (day) => {
    setSelectedDay(day.fullDate);
    if (scrollViewRef.current) {
      const currentDayIndex = days.findIndex(d => d.fullDate === day.fullDate);
      scrollViewRef.current.scrollTo({ x: currentDayIndex * 60 - screenWidth / 2 + 30, animated: true });
    }
  };

  const getCurrentMonth = () => {
    const selectedDate = new Date(selectedDay);
    const options = { month: 'long' };
    return selectedDate.toLocaleDateString('en-US', options);
  };

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const dayWidth = 60; // Width of each day item
    const currentIndex = Math.round(offsetX / dayWidth);
    if (days[currentIndex]) {
      setSelectedDay(days[currentIndex].fullDate);
    }
  };

  const sampleActivities = [
    new ActivityModel(1, 'Running', 'run-icon', 'km', 'Morning run', 'Fitness', 123),
    new ActivityModel(2, 'Swimming', 'swim-icon', 'laps', 'Evening swim', 'Fitness', 124),
  ];

  return (
    <SafeAreaView style={styles.wrapper}>
      <Text style={styles.monthText}>{getCurrentMonth()}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.menu}
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={60}
        decelerationRate="fast"
      >
        <View style={{ width: screenWidth / 2 - 30 }} />
        {days.map((day, index) => (
          <TouchableOpacity key={index} style={styles.dayContainer} onPress={() => handleDayClick(day)}>
            <Text style={[
              styles.dayText,
              day.fullDate === selectedDay && styles.selectedDayText,
              (index === 0 || index === days.length - 1) && styles.transparentDayText
            ]}>
              {day.date}
            </Text>
            <Text style={styles.weekdayText}>{day.weekday}</Text>
          </TouchableOpacity>
        ))}
        <View style={{ width: screenWidth / 2 - 30 }} />
      </ScrollView>
      <ActivitySection title="Today's Activities" activities={sampleActivities} />
    </SafeAreaView>
  );
};

const DaysBeforeAndAfter = (startDate) => {
  const days = [];
  const options = { weekday: 'short' };
  const start = new Date(startDate);
  start.setMonth(start.getMonth() - 1);
  const end = new Date(startDate);
  end.setMonth(end.getMonth() + 1);

  for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
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
    backgroundColor: 'white',
  },
  dayContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  dayText: {
    fontSize: 24,
    color: 'black',
  },
  selectedDayText: {
    color: 'blue',
    fontSize: 28,
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
  transparentDayText: {
    opacity: 0.5,
  },
});

export default Activities;
