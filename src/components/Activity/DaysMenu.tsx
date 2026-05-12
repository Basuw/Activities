import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from 'styled-components';
import dayjs from 'dayjs';
import debounce from 'lodash/debounce';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DAY_WIDTH = SCREEN_WIDTH / 7;

interface Day {
  date: number;
  weekday: string;
  fullDate: string;
}

interface DayMenuProps {
  selectedDay: string;
  onDaySelect: (day: string) => void;
}

const buildDays = (): Day[] => {
  const days: Day[] = [];
  const start = dayjs().subtract(30, 'day');
  const end = dayjs().add(30, 'day');
  let cur = start;
  while (cur.isBefore(end) || cur.isSame(end, 'day')) {
    days.push({
      date: cur.date(),
      weekday: cur.format('ddd'),
      fullDate: cur.format('YYYY-MM-DD'),
    });
    cur = cur.add(1, 'day');
  }
  return days;
};

const DAYS = buildDays();
const TODAY = dayjs().format('YYYY-MM-DD');

const DayMenu: React.FC<DayMenuProps> = ({ selectedDay, onDaySelect }) => {
  const theme = useTheme();
  const scrollRef = useRef<ScrollView>(null);

  const scrollToDay = useCallback((date: string, animated = true) => {
    const idx = DAYS.findIndex(d => d.fullDate === date);
    if (idx >= 0 && scrollRef.current) {
      scrollRef.current.scrollTo({ x: idx * DAY_WIDTH, animated });
    }
  }, []);

  useEffect(() => {
    setTimeout(() => scrollToDay(selectedDay, false), 50);
  }, []);

  const debouncedSelect = useCallback(
    debounce((day: string) => onDaySelect(day), 120),
    [onDaySelect],
  );

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / DAY_WIDTH);
    const day = DAYS[idx];
    if (day && day.fullDate !== selectedDay) {
      debouncedSelect(day.fullDate);
    }
  };

  const handleDayPress = (day: Day) => {
    onDaySelect(day.fullDate);
    scrollToDay(day.fullDate);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={DAY_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.content}
      >
        {DAYS.map((day, idx) => {
          const isSelected = day.fullDate === selectedDay;
          const isToday = day.fullDate === TODAY;
          return (
            <TouchableOpacity
              key={idx}
              style={styles.dayContainer}
              onPress={() => handleDayPress(day)}
            >
              <Text style={[styles.weekday, { color: isSelected ? theme.main : theme.secondary }]}>
                {day.weekday}
              </Text>
              <View
                style={[
                  styles.dateCircle,
                  isSelected && { backgroundColor: theme.main },
                  isToday && !isSelected && { borderWidth: 2, borderColor: theme.main },
                ]}
              >
                <Text
                  style={[
                    styles.date,
                    { color: isSelected ? 'white' : isToday ? theme.main : theme.foreground },
                    isSelected && styles.dateSelected,
                  ]}
                >
                  {day.date}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  content: {
    paddingHorizontal: (SCREEN_WIDTH - DAY_WIDTH) / 2,
  },
  dayContainer: {
    width: DAY_WIDTH,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  weekday: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
    fontWeight: '500',
  },
  dateSelected: {
    fontWeight: '700',
  },
});

export default DayMenu;
