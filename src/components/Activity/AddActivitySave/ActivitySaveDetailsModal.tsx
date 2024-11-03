import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'styled-components';
import { DEV_API_URL } from '@env';
import Slider from '@react-native-community/slider';
import ActivityDTO from '../../../dto/activities/ActivityDTO';
import UserModel from '../../../models/UserModel.ts';
import PostActivitySaveDTO from '../../../dto/activities/postActivitySave/PostActivitySaveDTO.tsx';
import PostActivityDTO from '../../../dto/activities/postActivitySave/PostActivityDTO.tsx';
import PostUserDTO from '../../../dto/activities/postActivitySave/PostUserDTO.tsx';
import DayEnum from '../../../models/Activities/DayEnum.ts';

interface ActivitySaveDetailsModalProps {
  isVisible: boolean;
  activity: ActivityDTO;
  onClose: () => void;
  user: UserModel;
  refreshActivities: () => void; // Add this prop
}

const ActivitySaveDetailsModal: React.FC<ActivitySaveDetailsModalProps> = ({ isVisible, activity, onClose, user, refreshActivities}) => {
  const theme = useTheme();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [frequency, setFrequency] = useState<number>(1);
  const [objective, setObjective] = useState<number>(0);

  const handleDaySelect = (day: string) => {
    setSelectedDay(day === selectedDay ? null : day);
  };

  const handleSave = () => {
    postActivitySave();
    refreshActivities();
    onClose();
  };

  const postActivitySave = () => {
    const activitySave = new PostActivitySaveDTO(
      frequency,
      objective,
      'notes',
      new PostActivityDTO(activity.id),
      new PostUserDTO(user.id),
      dayEnumFromString(),
    );

    const url = `${DEV_API_URL}/save`;
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activitySave),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('Failed to fetch data');
        }
      })
      .catch((error) => {
        console.error('Error while posting new activitySave:', error);
      });
  };

  const dayEnumFromString = (): DayEnum | undefined => {
    switch (selectedDay) {
      case 'Mo':
        return DayEnum.MONDAY;
      case 'Tu':
        return DayEnum.TUESDAY;
      case 'We':
        return DayEnum.WEDNESDAY;
      case 'Th':
        return DayEnum.THURSDAY;
      case 'Fr':
        return DayEnum.FRIDAY;
      case 'Sa':
        return DayEnum.SATURDAY;
      case 'Su':
        return DayEnum.SUNDAY;
      default:
        return;
    }
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
              <Text style={{ color: theme.foreground, fontSize: 18, marginBottom: 10 }}>{activity.name}</Text>
              <View style={styles.contentContainer}>
                <View style={styles.leftContainer}>
                  <Text style={{ color: theme.foreground, marginBottom: 10 }}>Days:</Text>
                  {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleDaySelect(day)}
                      style={[
                        styles.dayButton,
                        selectedDay === day && { backgroundColor: theme.purple },
                      ]}
                    >
                      <Text style={{ color: selectedDay === day ? theme.foreground : theme.purple }}>{day}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.rightContainer}>
                  <Text style={{ color: theme.foreground, marginBottom: 20 }}>Frequency:</Text>
                  <Text style={{ color: theme.foreground, marginBottom: 20 }}>{frequency} times per week</Text>
                  <View style={styles.frequencyButtons}>
                    <TouchableOpacity onPress={() => setFrequency((prev) => Math.max(1, prev - 1))} style={styles.frequencyButton}>
                      <Text style={{ color: theme.purple }}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setFrequency((prev) => prev + 1)} style={styles.frequencyButton}>
                      <Text style={{ color: theme.purple }}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={{ color: theme.foreground, marginBottom: 20 }}>Objective:</Text>
                  <TextInput
                    style={[styles.objectiveInput, { color: theme.foreground, borderColor: theme.foreground }]}
                    keyboardType="numeric"
                    value={objective.toString()}
                    onChangeText={(text) => setObjective(Number(text))}
                  />
                  <Text style={{ color: theme.foreground, marginBottom: 20 }}>{activity.unity}</Text>
                  <Slider
                    style={{ width: 150, height: 40 }}
                    minimumValue={0}
                    maximumValue={100}
                    step={1}
                    value={objective}
                    onValueChange={(value) => setObjective(value)}
                    minimumTrackTintColor={theme.purple}
                    maximumTrackTintColor={theme.foreground}
                  />
                  <TouchableOpacity onPress={handleSave} style={[styles.saveButton, { backgroundColor: 'limegreen', marginTop: 20 }]}>
                    <Text style={{ color: theme.foreground }}>Save Activity</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={24} color={theme.foreground} />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightContainer: {
    flex: 2,
    alignItems: 'center',
  },
  dayButton: {
    margin: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'lightgray',
    width: 50,
    alignItems: 'center',
  },
  frequencyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginBottom: 10,
  },
  frequencyButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    width: 40,
  },
  objectiveInput: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
    textAlign: 'center',
    width: 100,
  },
  saveButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default ActivitySaveDetailsModal;
