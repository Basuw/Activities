import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'styled-components';
import StubService from '../services/stub.ts';
import ActivityModel from '../models/Activities/ActivityModel.ts';

interface AddActivitySaveProps {
  isVisible: boolean;
  onClose: () => void;
}

const AddActivitySave: React.FC<AddActivitySaveProps> = ({ isVisible, onClose }) => {
  const theme = useTheme();
  const [activities, setActivities] = useState<ActivityModel[]>([]);

  useEffect(() => {
    const stubService = new StubService();
    const fetchedActivities = stubService.activities;
    console.log('Fetched Activities:', fetchedActivities); // Debug log
    const sortedActivities = fetchedActivities.sort((a, b) => a.category.localeCompare(b.category));
    setActivities(sortedActivities);
  }, []);

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
            <View style={[styles.modalContainer, {backgroundColor: theme.background}]}>
              <View style={[styles.modalContent, {backgroundColor: theme.background}]}>
                <Text style={{ color: theme.foreground, fontSize: 18, marginBottom: 10 }}>Activities</Text>
                {activities.length === 0 ? (
                  <Text style={{ color: theme.foreground }}>No activities available</Text>
                ) : (
                  activities.map((activity, index) => (
                    <Text key={index} style={{ color: theme.foreground }}>
                      {activity.category}: {activity.name}
                    </Text>
                  ))
                )}
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <MaterialCommunityIcons name="close" size={24} color={theme.foreground} />
                </TouchableOpacity>
              </View>
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
  modalContent: {
    alignItems: 'center',
    backgroundColor: 'white', // Ensure the content is visible
    padding: 20,
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default AddActivitySave;
