// src/components/Activity/SelectActivitySaveModal.tsx
import React, {useEffect, useState} from 'react';
import {Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import {DEV_API_URL} from '@env';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'styled-components';
import ActivitySaveDetailsModal from './ActivitySaveDetailsModal.tsx';
import UserModel from '../../../models/UserModel.ts';
import ActivityDTO from '../../../dto/activities/ActivityDTO.tsx';

interface AddActivitySaveProps {
  isVisible: boolean;
  user: UserModel;
  onClose: () => void;
  fetchActivitiesDone: () => void;
}

const SelectActivitySaveModal: React.FC<AddActivitySaveProps> = ({ isVisible, onClose, user, fetchActivitiesDone}) => {
  const theme = useTheme();
  const [activities, setActivities] = useState<{ [key: string]: ActivityDTO[] }>({});
  const [selectedActivity, setSelectedActivity] = useState<ActivityDTO | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
  let fecthedActivitiesDTO : ActivityDTO[] = [];

  useEffect(() => {
    //const stubService = new StubService();
    //const fetchedActivities = stubService.activities;
    getActivities();
  }, []);

  function activitiesToListWithCategory(list: ActivityDTO[]) {
    return list.reduce((acc, activity) => {
      if (!acc[activity.category]) {
        acc[activity.category] = [];
      }
      acc[activity.category].push(activity);
      return acc;
    }, {} as { [key: string]: ActivityDTO[] });
  }
  function getActivities() {
    const url = `${DEV_API_URL}/activity/all/user/${user.id}`;
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('Failed to fetch data');
        }
      })
      .then((responseData) => {
        if (responseData) {
          fecthedActivitiesDTO = responseData;
          const listCat =  activitiesToListWithCategory(fecthedActivitiesDTO);
          setActivities(listCat);
        } else {
          console.log('Empty response');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleActivityPress = (activity: ActivityDTO) => {
    setSelectedActivity(activity);
  };

  const closeActivityDetails = () => {
    onClose();
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
              <ScrollView contentContainerStyle={[styles.modalContent, { backgroundColor: theme.background }]}>
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
        <ActivitySaveDetailsModal
          isVisible={!!selectedActivity}
          activity={selectedActivity}
          onClose={closeActivityDetails}
          user={user}
          refreshActivities={fetchActivitiesDone}
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
    alignItems: 'flex-start',
  },
  modalContent: {
    alignItems: 'flex-start',
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
    marginBottom: 10,
    textAlign: 'left',
    alignContent: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingLeft: 40, // Augmenter le padding pour décaler les noms des activités
  },
});

export default SelectActivitySaveModal;
