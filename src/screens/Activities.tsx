import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import ActivitySection from '../components/ActivitySection';
import ActivityModel from '../models/ActivityModel';

const screenWidth = Dimensions.get('window').width;
const dayWidth = screenWidth / 5;

const Activities = () => {
  const [startDate] = useState(new Date());
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(
    new Date().toISOString().split('T')[0],
  );
  const scrollViewRef = useRef<ScrollView>(null);
  const logTimeoutRef = useRef(null);

  useEffect(() => {
    const generatedDays = DaysBeforeAndAfter(startDate);
    setDays(generatedDays);
    // Center the current day as the 3rd element on initialization
    setTimeout(() => {
      if (scrollViewRef.current) {
        const currentDayIndex = generatedDays.findIndex(
          day => day.fullDate === selectedDay,
        );
        const offset = (currentDayIndex - 2) * dayWidth + 2 * dayWidth; // Adjust to center as the 3rd element
        scrollViewRef.current.scrollTo({x: offset, animated: true});
      }
    }, 100);
  }, [startDate]);

  const handleDayClick = day => {
    setSelectedDay(day.fullDate);

    if (logTimeoutRef.current) {
      clearTimeout(logTimeoutRef.current);
    }

    logTimeoutRef.current = setTimeout(() => {
      console.log(`Selected Day: ${day.fullDate}`);
    }, 200); // Adjust the delay as needed

    if (scrollViewRef.current) {
      const currentDayIndex = days.findIndex(d => d.fullDate === day.fullDate);
      const offset = (currentDayIndex - 2) * dayWidth + 2 * dayWidth; // Adjust to center as the 3rd element
      scrollViewRef.current.scrollTo({x: offset, animated: true});
    }
  };

  const getCurrentMonth = () => {
    const selectedDate = new Date(selectedDay);
    const options = {month: 'long'};
    return selectedDate.toLocaleDateString('en-US', options);
  };

  const handleScroll = event => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(offsetX / dayWidth);
    if (days[currentIndex]) {
      setSelectedDay(days[currentIndex].fullDate);

      if (logTimeoutRef.current) {
        clearTimeout(logTimeoutRef.current);
      }

      logTimeoutRef.current = setTimeout(() => {
        console.log(`Selected Day: ${days[currentIndex].fullDate}`);
      }, 500); // Adjust the delay as needed
    }
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
      <View style={styles.scrollContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.menu}
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          snapToInterval={dayWidth}
          decelerationRate="fast">
          <View style={{width: screenWidth / 2 - dayWidth / 2}} />
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dayContainer}
              onPress={() => handleDayClick(day)}>
              <Text
                style={[
                  styles.dayText,
                  day.fullDate === selectedDay && styles.selectedDayText,
                  day.fullDate === new Date().toISOString().split('T')[0] &&
                    styles.currentDayText,
                ]}>
                {day.date}
              </Text>
              <Text style={styles.weekdayText}>{day.weekday}</Text>
            </TouchableOpacity>
          ))}
          <View style={{width: screenWidth / 2 - dayWidth / 2}} />
        </ScrollView>
      </View>
      <ActivitySection
        title="Today's Activities"
        activities={sampleActivities}
      />
    </SafeAreaView>
  );
};

const DaysBeforeAndAfter = startDate => {
  const days = [];
  const options = {weekday: 'short'};
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
  scrollContainer: {
    position: 'relative',
  },
  menu: {
    width: '100%',
    height: '10%',
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  dayContainer: {
    alignItems: 'center',
    width: dayWidth,
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
