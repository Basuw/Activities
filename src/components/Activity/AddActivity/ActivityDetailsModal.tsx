import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'styled-components';
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
  const [objective, setObjective] = useState<string>('');

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
              <Text style={{ color: theme.foreground, marginBottom: 10 }}>Select Days:</Text>
              <View style={styles.calendarContainer}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleDaySelect(day)}
                    style={[
                      styles.dayButton,
                      selectedDays.includes(day) && { backgroundColor: theme.purple },
                    ]}
                  >
                    <Text style={{ color: theme.foreground }}>{day[1]}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={{ color: theme.foreground, marginBottom: 10 }}>Frequency:</Text>
              <Text style={{ color: theme.foreground, marginBottom: 10 }}>{frequency} times per week</Text>
              <View style={styles.frequencyButtons}>
                <TouchableOpacity onPress={() => setFrequency((prev) => Math.max(1, prev - 1))} style={styles.frequencyButton}>
                  <Text style={{ color: theme.foreground }}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFrequency((prev) => prev + 1)} style={styles.frequencyButton}>
                  <Text style={{ color: theme.foreground }}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={handleSave} style={[styles.saveButton, { backgroundColor: 'limegreen' }]}>
                <Text style={{ color: 'white' }}>Save Activity</Text>
              </TouchableOpacity>
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
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayButton: {
    margin: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'lightgray',
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
