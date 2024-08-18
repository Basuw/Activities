import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const dayWidth = screenWidth / 5;

interface DayMenuProps {
  selectedDay: string;
  onDaySelect: (day: string) => void;
}

const DayMenu: React.FC<DayMenuProps> = ({selectedDay, onDaySelect}) => {
  const [days, setDays] = useState([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const DaysBeforeAndAfter = (startDate: Date) => {
    const days = [];
    const options = {weekday: 'short'};
    const start = new Date(startDate);
    start.setMonth(start.getMonth() - 1);
    const end = new Date(startDate);
    end.setMonth(end.getMonth() + 1);

    for (
      let day = new Date(start);
      day <= end;
      day.setDate(day.getDate() + 1)
    ) {
      days.push({
        date: day.getDate(),
        weekday: day.toLocaleDateString('en-US', options),
        fullDate: day.toISOString().split('T')[0], // Format as YYYY-MM-DD
      });
    }

    return days;
  };

  useEffect(() => {
    const startDate = new Date();
    const generatedDays = DaysBeforeAndAfter(startDate);
    setDays(generatedDays);

    // Center the current day as the 3rd element on initialization
    setTimeout(() => {
      if (scrollViewRef.current) {
        const currentDayIndex = generatedDays.findIndex(
          day => day.fullDate === new Date().toISOString().split('T')[0],
        );
        const offset = currentDayIndex * dayWidth; // Adjust to center as the 3rd element
        scrollViewRef.current.scrollTo({x: offset, animated: true});
      }
    }, 100);
  }, []);

  const handleDayClick = day => {
    onDaySelect(day.fullDate);

    if (scrollViewRef.current) {
      const currentDayIndex = days.findIndex(d => d.fullDate === day.fullDate);
      const offset = currentDayIndex * dayWidth; // Adjust to center as the 3rd element
      scrollViewRef.current.scrollTo({x: offset, animated: true});
    }
  };

  const handleScroll = event => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(offsetX / dayWidth);
    if (days[currentIndex]) {
      onDaySelect(days[currentIndex].fullDate);
    }
  };

  return (
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
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    position: 'relative',
  },
  menu: {
    paddingTop: 5,
    width: '100%',
    height: '10%',
    flexDirection: 'row',
    backgroundColor: '#383838',
    borderRadius: 10,
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
    color: '#382bf0',
    fontSize: 28,
  },
  currentDayText: {
    color: '#f44336',
  },
  weekdayText: {
    fontSize: 16,
    color: 'black',
  },
});

export default DayMenu;
