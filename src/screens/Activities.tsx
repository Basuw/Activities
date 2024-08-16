import React from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const Activities = () => {
  const days = DaysBeforeAndAfter();

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.menu}>
        {days.map((day, index) => (
          <View key={index} style={styles.dayContainer}>
            <Text style={styles.dayText}>{day.date}</Text>
            <Text style={styles.weekdayText}>{day.weekday}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const DaysBeforeAndAfter = () => {
  const today = new Date();
  const days = [];
  const options = { weekday: 'short' };

  for (let i = -2; i <= 2; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() + i);
    days.push({
      date: day.getDate(),
      weekday: day.toLocaleDateString('en-US', options),
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
  weekdayText: {
    fontSize: 16,
    color: 'black',
  },
});

export default Activities;
