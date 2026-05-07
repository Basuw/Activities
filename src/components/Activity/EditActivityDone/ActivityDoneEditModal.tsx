import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from 'styled-components';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// @ts-ignore
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';
import ActivityDoneDTO from '../../../dto/activities/ActivityDoneDTO';

interface Props {
  isVisible: boolean;
  activity: ActivityDoneDTO;
  onClose: () => void;
  onSave: (updated: ActivityDoneDTO) => void;
}

const ActivityDoneEditModal: React.FC<Props> = ({ isVisible, activity, onClose, onSave }) => {
  const theme = useTheme();
  const [achievement, setAchievement] = useState(activity.achievement);
  const [notes, setNotes] = useState(activity.notes ?? '');
  const [mark, setMark] = useState(activity.mark ?? 0);

  const handleSave = () => {
    onSave({ ...activity, achievement, notes, mark });
    onClose();
  };

  const objective = activity.activitySave.objective;
  const progress = objective > 0 ? Math.min((achievement / objective) * 100, 100) : 0;
  const isComplete = progress >= 100;

  return (
    <Modal animationType="slide" transparent visible={isVisible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: theme.background }]}>
          <View style={[styles.handle, { backgroundColor: theme.secondary }]} />

          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconWrap, { backgroundColor: `${theme.purple}22` }]}>
              <MaterialCommunityIcons
                name={activity.activitySave.activity.icon}
                size={28}
                color={theme.purple}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.activityName, { color: theme.foreground }]}>
                {activity.activitySave.activity.name}
              </Text>
              <Text style={[styles.subtitle, { color: theme.secondary }]}>
                Log your progress
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialCommunityIcons name="close" size={22} color={theme.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Achievement */}
            <Text style={[styles.sectionLabel, { color: theme.secondary }]}>ACHIEVEMENT</Text>
            <View style={[styles.card, { backgroundColor: theme.surface }]}>
              {/* Progress visual */}
              <View style={styles.progressRow}>
                <Text style={[styles.achievementValue, { color: isComplete ? theme.green : theme.foreground }]}>
                  {achievement}
                </Text>
                <Text style={[styles.objectiveText, { color: theme.secondary }]}>
                  /{objective} {activity.activitySave.activity.unity}
                </Text>
                {isComplete && (
                  <MaterialCommunityIcons name="check-circle" size={24} color={theme.green} style={{ marginLeft: 8 }} />
                )}
              </View>

              <View style={[styles.progressBarBg, { backgroundColor: theme.card }]}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${progress}%` as any,
                      backgroundColor: isComplete ? theme.green : theme.purple,
                    },
                  ]}
                />
              </View>

              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={objective}
                step={1}
                value={achievement}
                onValueChange={v => setAchievement(Math.round(v))}
                minimumTrackTintColor={isComplete ? theme.green : theme.purple}
                maximumTrackTintColor={theme.card}
                thumbTintColor={isComplete ? theme.green : theme.purple}
              />

              {/* Manual input */}
              <View style={styles.inputRow}>
                <TouchableOpacity
                  onPress={() => setAchievement(v => Math.max(0, v - 1))}
                  style={[styles.stepBtn, { backgroundColor: theme.card }]}
                >
                  <MaterialCommunityIcons name="minus" size={18} color={theme.purple} />
                </TouchableOpacity>
                <TextInput
                  style={[styles.achievementInput, { color: theme.foreground, borderColor: theme.border }]}
                  keyboardType="numeric"
                  value={String(achievement)}
                  onChangeText={v => {
                    const n = parseInt(v, 10);
                    if (!isNaN(n)) setAchievement(n);
                  }}
                />
                <TouchableOpacity
                  onPress={() => setAchievement(v => v + 1)}
                  style={[styles.stepBtn, { backgroundColor: theme.card }]}
                >
                  <MaterialCommunityIcons name="plus" size={18} color={theme.purple} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Rating */}
            <Text style={[styles.sectionLabel, { color: theme.secondary }]}>RATING</Text>
            <View style={[styles.card, { backgroundColor: theme.surface }]}>
              <View style={styles.starsRow}>
                {[0, 1, 2, 3, 4].map(i => (
                  <TouchableOpacity key={i} onPress={() => setMark(i + 1)}>
                    <FontAwesome
                      name={i < mark ? 'star' : 'star-o'}
                      size={32}
                      color={i < mark ? '#F59E0B' : theme.secondary}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Notes */}
            <Text style={[styles.sectionLabel, { color: theme.secondary }]}>NOTES</Text>
            <View style={[styles.card, { backgroundColor: theme.surface }]}>
              <TextInput
                style={[styles.notesInput, { color: theme.foreground, borderColor: theme.border }]}
                placeholder="How did it go?"
                placeholderTextColor={theme.secondary}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Actions */}
            <View style={styles.buttonsRow}>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.cancelBtn, { borderColor: theme.border }]}
              >
                <Text style={[styles.cancelText, { color: theme.secondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                style={[styles.saveBtn, { backgroundColor: theme.purple }]}
              >
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 34,
    maxHeight: SCREEN_HEIGHT * 0.88,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityName: { fontSize: 19, fontWeight: '700' },
  subtitle: { fontSize: 13, marginTop: 2 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: { borderRadius: 18, padding: 16, marginBottom: 20 },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
    gap: 4,
  },
  achievementValue: { fontSize: 36, fontWeight: '700' },
  objectiveText: { fontSize: 18 },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  slider: { width: '100%', height: 40 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 4,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementInput: {
    width: 80,
    height: 48,
    borderWidth: 1,
    borderRadius: 14,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    fontSize: 15,
    minHeight: 80,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: { fontSize: 16, fontWeight: '600' },
  saveBtn: {
    flex: 2,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
});

export default ActivityDoneEditModal;
