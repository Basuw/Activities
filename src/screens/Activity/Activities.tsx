import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'styled-components';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import dayjs from 'dayjs';
import ActivitySection from '../../components/Activity/ActivitySection';
import DayMenu from '../../components/Activity/DaysMenu';
import SelectActivitySaveModal from '../../components/Activity/AddActivitySave/SelectActivitySaveModal';
import ActivityProgressModel from '../../models/Activities/ActivityProgressModel';
import UserModel from '../../models/UserModel';
import { activityApiService } from '../../services/ActivityApiService';

const Activities = ({ user }: { user: UserModel }) => {
  const theme = useTheme();
  const [selectedDay, setSelectedDay] = useState(dayjs().format('YYYY-MM-DD'));
  const [activities, setActivities] = useState<ActivityProgressModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchActivities = useCallback(async (day?: string) => {
    const target = day ?? selectedDay;
    setLoading(true);
    setActivities([]);
    try {
      const data = await activityApiService.fetchActivitiesDone(target, user.id);
      setActivities(data);
    } catch (e) {
      console.error('Failed to fetch activities:', e);
    } finally {
      setLoading(false);
    }
  }, [selectedDay, user.id]);

  // Load today's activities on mount
  useEffect(() => {
    fetchActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDaySelect = (day: string) => {
    if (day === selectedDay) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSelectedDay(day);
      fetchActivities(day);
    }, 150);
  };

  const selectedDate = dayjs(selectedDay);
  const isToday = selectedDay === dayjs().format('YYYY-MM-DD');
  const isYesterday = selectedDay === dayjs().subtract(1, 'day').format('YYYY-MM-DD');

  const dayLabel = isToday
    ? 'Today'
    : isYesterday
    ? 'Yesterday'
    : selectedDate.format('dddd');

  return (
    <SafeAreaView style={[styles.wrapper, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.dayLabel, { color: theme.purple }]}>{dayLabel}</Text>
          <Text style={[styles.dateLabel, { color: theme.foreground }]}>
            {selectedDate.format('MMMM D, YYYY')}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.todayBtn, { backgroundColor: theme.surface }]}
          onPress={() => {
            const today = dayjs().format('YYYY-MM-DD');
            if (today !== selectedDay) {
              setSelectedDay(today);
              fetchActivities(today);
            }
          }}
        >
          <MaterialCommunityIcons name="calendar-today" size={18} color={theme.purple} />
          <Text style={[styles.todayBtnText, { color: theme.purple }]}>Today</Text>
        </TouchableOpacity>
      </View>

      {/* Day picker */}
      <DayMenu selectedDay={selectedDay} onDaySelect={handleDaySelect} />

      {/* Activities list */}
      <ActivitySection
        activities={activities}
        selectedDay={selectedDate.toDate()}
        loading={loading}
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.purple }]}
        onPress={() => setAddModalVisible(true)}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="plus" size={28} color="white" />
      </TouchableOpacity>

      <SelectActivitySaveModal
        isVisible={isAddModalVisible}
        onClose={() => setAddModalVisible(false)}
        user={user}
        fetchActivitiesDone={fetchActivities}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  dayLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  dateLabel: {
    fontSize: 22,
    fontWeight: '700',
  },
  todayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  todayBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});

export default Activities;
