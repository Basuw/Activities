import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'styled-components';
import ActivityModel from '../../models/Activities/ActivityModel.ts';

interface ActivityDetailsModalProps {
  isVisible: boolean;
  activity: ActivityModel;
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
              <View style={styles.daysContainer}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <TouchableOpacity
                    key={day}
                    onPress={() => handleDaySelect(day)}
                    style={[
                      styles.dayButton,
                      selectedDays.includes(day) && { backgroundColor: theme.purple },
                    ]}
                  >
                    <Text style={{ color: theme.foreground }}>{day}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={{ color: theme.foreground, marginBottom: 10 }}>Frequency:</Text>
              <Text style={{ color: theme.foreground, marginBottom: 10 }}>{frequency} times per week</Text>
              <TouchableOpacity onPress={() => setFrequency((prev) => prev + 1)}>
                <Text style={{ color: theme.foreground }}>Increase Frequency</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setFrequency((prev) => Math.max(1, prev - 1))}>
                <Text style={{ color: theme.foreground }}>Decrease Frequency</Text>
              </TouchableOpacity>
              <Text style={{ color: theme.foreground, marginBottom: 10 }}>Objective:</Text>
              <Text style={{ color: theme.foreground, marginBottom: 10 }}>{objective}</Text>
              <TouchableOpacity onPress={() => setObjective('New Objective')}>
                <Text style={{ color: theme.foreground }}>Set Objective</Text>
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
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  dayButton: {
    margin: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'lightgray',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default ActivityDetailsModal;
