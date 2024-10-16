import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback, TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'styled-components';
import Slider from '@react-native-community/slider';
import ActivityDTO from '../../../dto/activities/ActivityDTO';

interface ActivityDetailsModalProps {
  isVisible: boolean;
  activity: ActivityDTO;
  onClose: () => void;
}

const ActivityDetailsModal: React.FC<ActivityDetailsModalProps> = ({ isVisible, activity, onClose }) => {
  const theme = useTheme();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<number>(1);
  const [objective, setObjective] = useState<number>(0);

  const handleDaySelect = (day: string) => {
    setSelectedDays((prevDays) =>
      prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day]
    );
  };

  const handleSave = () => {
    // Logic to save the activity
    onClose();
  };

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
                        selectedDays.includes(day) && { backgroundColor: theme.purple },
                      ]}
                    >
                      <Text style={{ color: selectedDays.includes(day) ? theme.foreground : theme.purple }}>{day}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.rightContainer}>
                  <Text style={{ color: theme.foreground, marginBottom: 20 }}>Frequency:</Text>
                  <Text style={{ color: theme.foreground, marginBottom: 20 }}>{frequency} times per week</Text>
                  <View style={styles.frequencyButtons}>
                    <TouchableOpacity onPress={() => setFrequency((prev) => Math.max(1, prev - 1))} style={styles.frequencyButton}>
                      <Text style={{ color: theme.foreground }}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setFrequency((prev) => prev + 1)} style={styles.frequencyButton}>
                      <Text style={{ color: theme.foreground }}>+</Text>
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
                  <TouchableOpacity onPress={handleSave} style={[styles.saveButton, { backgroundColor: 'limegreen' }]}>
                    <Text style={{ color: 'white' }}>Save Activity</Text>
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

export default ActivityDetailsModal;
