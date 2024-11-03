import React, { useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ActivitySection from '../../components/Activity/ActivitySection';
import DayMenu from '../../components/Activity/DaysMenu';
import { DEV_API_URL } from '@env';
import ActivityProgressModel from '../../models/Activities/ActivityProgressModel.ts';
import SelectActivitySaveModal from '../../components/Activity/AddActivity/SelectActivitySaveModal.tsx';
import UserModel from '../../models/UserModel.ts';
import ActivityDoneDTO from '../../dto/activities/ActivityDoneDTO.tsx';
import ActivitySaveDTO from '../../dto/activities/ActivitySaveDTO.tsx';
import ActivityDTO from '../../dto/activities/ActivityDTO.tsx';

const Activities = (props: { user:UserModel }) => {
  const theme = useTheme();
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().split('T')[0]);
  const [activities, setActivities] = useState<ActivityProgressModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const idRef = useRef(-1);


  const logTimeoutRef = useRef<null | NodeJS.Timeout>(null);

  const handleDaySelect = (day: string) => {
    if (day === selectedDay) {
      return; // Do nothing if the selected day is the same as the current day
    }

    if (logTimeoutRef.current) {
      clearTimeout(logTimeoutRef.current);
    }
    setSelectedDay(day);
    console.log(`Selected Day1: ${day}`);

    logTimeoutRef.current = setTimeout(() => {
      console.log(`Selected Day2: ${day}`);
      fetchActivities();

    }, 150); // Adjust the delay as needed
    console.log(`Selected Day3: ${day}`);

  };

  const fetchActivitiesDone = () => {
    setLoading(true);
    let data;
    try {
      console.log('selectedDay fetch',selectedDay);
      const url = `${DEV_API_URL}/day_activities/user_id/${props.user.id}?date=${selectedDay}`;
      fetch(url).then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('Failed to fetch data');
        }
      })
      .then((responseData) => {
        data = responseData;
        setActivities(setActivityDoneObjectList(data));
      });
    } catch (e) {
      console.log('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const setActivityDoneObjectList = (data:string[]) => {
    const dataActivitiesProgress: ActivityProgressModel[] = data.map((item: any) => new ActivityProgressModel(
        new ActivityDoneDTO(
            item.activityDone.id,
            item.activityDone.achievement,
            item.activityDone.doneOn,
            new ActivitySaveDTO(
                item.activityDone.activitySave.id,
                item.activityDone.activitySave.frequency,
                item.activityDone.activitySave.objective,
                new ActivityDTO(
                    item.activityDone.activitySave.activity.id,
                    item.activityDone.activitySave.activity.name,
                    item.activityDone.activitySave.activity.description,
                    item.activityDone.activitySave.activity.unity,
                    item.activityDone.activitySave.activity.icon,
                    item.activityDone.activitySave.activity.category,
                    item.activityDone.activitySave.activity.userId,
                ),
                item.activityDone.activitySave.userId),
            item.activityDone.mark,
            item.activityDone.notes,
            item.activityDone.status,
            item.activityDone.duration,
        ),
        item.weekProgress,
        item.weekObjective,
    ));
    for (let i = 0; i < dataActivitiesProgress.length; i++) {
      if (dataActivitiesProgress[i].activityDone.id === 0) {
        dataActivitiesProgress[i].activityDone.id = idRef.current;
        idRef.current--;
      }
    }
    return dataActivitiesProgress;
  };


  const fetchActivities = () =>{
    setActivities([]); // Clear activities before setting the new day
    fetchActivitiesDone();
  };

  const getCurrentMonth = () => {
    const selectedDate = new Date(selectedDay);
    const options: Intl.DateTimeFormatOptions = { month: 'long' };
    return selectedDate.toLocaleDateString('en-US', options);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <SafeAreaView style={[styles.wrapper, { backgroundColor: theme.background }]}>
      <Text style={[styles.monthText, { color: theme.foreground }]}>{getCurrentMonth()}</Text>
      <DayMenu selectedDay={selectedDay} onDaySelect={handleDaySelect} />
        <ActivitySection title="Morning Activities" activities={activities} selectedDay={selectedDay}/>
      <TouchableOpacity style={[styles.addActivity,{backgroundColor: theme.purple}]} onPress={toggleModal}>
        <MaterialCommunityIcons name="plus" size={24} color='white' />
      </TouchableOpacity>
      <SelectActivitySaveModal isVisible={isModalVisible} onClose={toggleModal} user={props.user} fetchActivitiesDone={fetchActivities}/>
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
  addActivity: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure FAB is above other content
  },
});

export default Activities;
