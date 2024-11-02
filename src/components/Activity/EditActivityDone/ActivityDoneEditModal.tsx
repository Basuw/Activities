import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import ActivityDoneDTO from '../../../dto/activities/ActivityDoneDTO.tsx';
import { useTheme } from 'styled-components';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// @ts-ignore
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface ActivityDoneEditModalProps {
  isVisible: boolean;
  activity: ActivityDoneDTO;
  onClose: () => void;
  onSave: (updatedActivity: ActivityDoneDTO) => void;
}

const ActivityDoneEditModal: React.FC<ActivityDoneEditModalProps> = ({ isVisible, activity, onClose, onSave }) => {
  const [achievement, setAchievement] = useState(activity.achievement);
  const [notes, setNotes] = useState(activity.notes);
  const [mark, setMark] = useState(activity.mark);
  const [height, setHeight] = useState(10);

  const theme = useTheme();

  const handleSave = () => {
    const updatedActivity = { ...activity, achievement, notes, mark };
    onSave(updatedActivity);
    onClose();
  };

  const incrementAchievement = () => setAchievement(prev => prev + 1);
  const decrementAchievement = () => setAchievement(prev => Math.max(0, prev - 1));

  const handleStarPress = (index: number) => {
    setMark(index + 1);
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
              <Text style={[styles.modalTitle, { color: theme.foreground }]}>
                How <MaterialCommunityIcons name={activity.activitySave.activity.icon} size={24} color={theme.foreground} />'ing goes?
              </Text>
              <Text style={[styles.fieldTitle, { color: theme.foreground }]}>Achievement</Text>
              <View style={styles.achievementContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={activity.activitySave.objective}
                  step={1}
                  value={achievement}
                  onValueChange={setAchievement}
                  minimumTrackTintColor={theme.purple}
                  maximumTrackTintColor={theme.foreground}
                />
                <View style={styles.inputContainer}>
                  <TouchableOpacity onPress={decrementAchievement} style={styles.arrowButton}>
                    <Text style={{ color: theme.foreground }}>-</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={[styles.input, { color: theme.foreground }]}
                    keyboardType="numeric"
                    value={achievement.toString()}
                    onChangeText={(text) => setAchievement(Number(text))}
                  />
                  <TouchableOpacity onPress={incrementAchievement} style={styles.arrowButton}>
                    <Text style={{ color: theme.foreground }}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.objectiveText, { color: theme.foreground }]}>/{activity.activitySave.objective}</Text>
              </View>
              <Text style={[styles.fieldTitle,  { color: theme.foreground}]}>Notes</Text>
              <TextInput
                style={[styles.input, { color: theme.foreground, width: '100%', minHeight: height }]}
                placeholder="Notes"
                value={notes}
                onChangeText={setNotes}
                multiline
                onContentSizeChange={(e) => setHeight(e.nativeEvent.contentSize.height)}
              />
              <Text style={[styles.fieldTitle, { color: theme.foreground }]}>Mark</Text>
              <View style={styles.starsContainer}>
                {[...Array(5)].map((_, index) => (
                  <TouchableOpacity key={index} onPress={() => handleStarPress(index)}>
                    <FontAwesome
                      name={index < mark ? 'star' : 'star-o'}
                      size={24}
                      color={theme.purple}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Button title="Save" onPress={handleSave} />
              <Button title="Cancel" onPress={onClose} />
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
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  fieldTitle: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  achievementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  slider: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: 50,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    textAlign: 'center',
    borderRadius: 8,
  },
  arrowButton: {
    padding: 10,
  },
  objectiveText: {
    fontSize: 18,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
});

export default ActivityDoneEditModal;
