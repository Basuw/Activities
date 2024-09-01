import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'styled-components';
import StubService from '../../services/stub.ts';
import ActivityModel from '../../models/Activities/ActivityModel.ts';
import ActivityDetailsModal from './ActivityDetailsModal.tsx';

interface AddActivitySaveProps {
  isVisible: boolean;
  onClose: () => void;
}

const AddActivitySave: React.FC<AddActivitySaveProps> = ({ isVisible, onClose }) => {
  const theme = useTheme();
  const [activities, setActivities] = useState<{ [key: string]: ActivityModel[] }>({});
  const [selectedActivity, setSelectedActivity] = useState<ActivityModel | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const stubService = new StubService();
    const fetchedActivities = stubService.activities;
    const groupedActivities = fetchedActivities.reduce((acc, activity) => {
      if (!acc[activity.category]) {
        acc[activity.category] = [];
      }
      acc[activity.category].push(activity);
      return acc;
    }, {} as { [key: string]: ActivityModel[] });
    setActivities(groupedActivities);
  }, []);

  const handleActivityPress = (activity: ActivityModel) => {
    setSelectedActivity(activity);
  };

  const closeActivityDetails = () => {
    setSelectedActivity(null);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
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
              <ScrollView contentContainerStyle={[styles.modalContent,{ backgroundColor: theme.background }] }>
                {Object.keys(activities).map((category) => (
                  <View key={category} style={{ backgroundColor: theme.background, marginTop: 12 }}>
                    <TouchableOpacity onPress={() => toggleCategory(category)} style={styles.categoryHeader}>
                      <MaterialCommunityIcons
                        name={expandedCategories[category] ? 'chevron-down' : 'chevron-right'}
                        size={24}
                        color={theme.foreground}
                      />
                      <Text style={{ color: theme.foreground, fontSize: 24, marginLeft: 10 }}>{category}</Text>
                    </TouchableOpacity>
                    {expandedCategories[category] && activities[category].map((activity) => (
                      <TouchableOpacity key={activity.name} onPress={() => handleActivityPress(activity)} style={styles.activityItem}>
                        <MaterialCommunityIcons name={activity.icon} size={24} color={theme.foreground} />
                        <Text style={{ color: theme.foreground, marginLeft: 10, fontSize: 18 }}>{activity.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={24} color={theme.foreground} />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
      {selectedActivity && (
        <ActivityDetailsModal
          isVisible={!!selectedActivity}
          activity={selectedActivity}
          onClose={closeActivityDetails}
        />
      )}
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
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
});

export default AddActivitySave;
