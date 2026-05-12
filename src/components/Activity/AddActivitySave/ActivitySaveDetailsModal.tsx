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
import Slider from '@react-native-community/slider';
import DayEnum from '../../../models/Activities/DayEnum';
import { activityApiService } from '../../../services/ActivityApiService';
import ActivitySaveModel from "../../../models/Activities/ActivitySaveModel.ts";

const DAYS: { short: string; full: DayEnum }[] = [
  { short: 'Mo', full: DayEnum.MONDAY },
  { short: 'Tu', full: DayEnum.TUESDAY },
  { short: 'We', full: DayEnum.WEDNESDAY },
  { short: 'Th', full: DayEnum.THURSDAY },
  { short: 'Fr', full: DayEnum.FRIDAY },
  { short: 'Sa', full: DayEnum.SATURDAY },
  { short: 'Su', full: DayEnum.SUNDAY },
];

interface Props {
  isVisible: boolean;
  activitySave: ActivitySaveModel;
  onClose: () => void;
  refreshActivities: () => void;
}

const ActivitySaveDetailsModal: React.FC<Props> = ({
  isVisible,
  activitySave,
  onClose,
  refreshActivities,
}) => {
  const theme = useTheme();
  const [selectedDays, setSelectedDays] = useState<DayEnum[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleDay = (day: DayEnum) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day],
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const days = selectedDays.length > 0 ? selectedDays : [undefined as any];
      await Promise.all(
        days.map((day: DayEnum | string) =>{
            activitySave.day=day;
            activityApiService.createActivitySave({
              activitySave
            })
        }
        ),
      );
      refreshActivities();
      onClose();
    } catch (e) {
      console.error('Failed to save activity', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={[styles.sheet, {backgroundColor: theme.background}]}>
          <View style={[styles.handle, {backgroundColor: theme.secondary}]} />

          {/* Activity header */}
          <View style={styles.activityHeader}>
            <View
              style={[
                styles.iconWrapper,
                {backgroundColor: `${theme.main}22`},
              ]}>
              <MaterialCommunityIcons
                name={activitySave.activity.icon}
                size={32}
                color={theme.main}
              />
            </View>
            <View style={{flex: 1}}>
              <Text style={[styles.activityName, {color: theme.foreground}]}>
                {activitySave.activity.name}
              </Text>
              <Text style={[styles.activityCategory, {color: theme.secondary}]}>
                {activitySave.activity.category}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <MaterialCommunityIcons
                name="close"
                size={22}
                color={theme.secondary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Schedule */}
            <Text style={[styles.sectionLabel, {color: theme.secondary}]}>
              SCHEDULE
            </Text>
            <View style={[styles.card, {backgroundColor: theme.surface}]}>
              <Text style={[styles.fieldLabel, {color: theme.foreground}]}>
                Days of the week
              </Text>
              <Text style={[styles.fieldHint, {color: theme.secondary}]}>
                Leave empty to track on any day
              </Text>
              <View style={styles.daysRow}>
                {DAYS.map(({short, full}) => (
                  <TouchableOpacity
                    key={short}
                    onPress={() => toggleDay(full)}
                    style={[
                      styles.dayBtn,
                      {borderColor: theme.main},
                      selectedDays.includes(full) && {
                        backgroundColor: theme.main,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.dayText,
                        {
                          color: selectedDays.includes(full)
                            ? 'white'
                            : theme.secondary,
                        },
                      ]}>
                      {short}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Frequency */}
            <Text style={[styles.sectionLabel, {color: theme.secondary}]}>
              FREQUENCY
            </Text>
            <View style={[styles.card, {backgroundColor: theme.surface}]}>
              <View style={styles.counterRow}>
                <TouchableOpacity
                  onPress={() => activitySave.frequency = f => Math.max(1, f - 1))}
                  style={[styles.counterBtn, {backgroundColor: theme.card}]}>
                  <MaterialCommunityIcons
                    name="minus"
                    size={20}
                    color={theme.main}
                  />
                </TouchableOpacity>
                <View style={styles.counterDisplay}>
                  <Text
                    style={[styles.counterNumber, {color: theme.foreground}]}>
                    {activitySave.frequency}
                  </Text>
                  <Text style={[styles.counterUnit, {color: theme.secondary}]}>
                    times / week
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => activitySave.frequency = (f:number => f + 1)}
                  style={[styles.counterBtn, {backgroundColor: theme.card}]}>
                  <MaterialCommunityIcons
                    name="plus"
                    size={20}
                    color={theme.main}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Objective */}
            <Text style={[styles.sectionLabel, {color: theme.secondary}]}>
              OBJECTIVE
            </Text>
            <View style={[styles.card, {backgroundColor: theme.surface}]}>
              <View style={styles.objectiveDisplay}>
                <Text
                  style={[styles.objectiveValue, {color: theme.foreground}]}>
                  {activitySave.objective}
                </Text>
                <Text style={[styles.objectiveUnit, {color: theme.secondary}]}>
                  {activitySave.activity.unity}
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={50}
                step={1}
                value={activitySave.objective}
                onValueChange={v => activitySave.objective = (Math.round(v))}
                minimumTrackTintColor={theme.main}
                maximumTrackTintColor={theme.border}
                thumbTintColor={theme.main}
              />
              <TextInput
                style={[
                  styles.objectiveInput,
                  {color: theme.foreground, borderColor: theme.border},
                ]}
                keyboardType="numeric"
                value={String(activitySave.objective)}
                onChangeText={v => {
                  const n = parseInt(v, 10);
                  if (!isNaN(n)) activitySave.objetive = n;
                }}
              />
            </View>

            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              style={[
                styles.saveBtn,
                {backgroundColor: theme.main},
                saving && {opacity: 0.6},
              ]}>
              <Text style={styles.saveBtnText}>
                {saving ? 'Saving…' : 'Save Activity'}
              </Text>
            </TouchableOpacity>

            <View style={{height: 40}} />
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
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 6,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityName: { fontSize: 20, fontWeight: '700' },
  activityCategory: { fontSize: 14, marginTop: 2 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  fieldLabel: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  fieldHint: { fontSize: 12, marginBottom: 14 },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  dayText: { fontSize: 12, fontWeight: '600' },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counterBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterDisplay: { alignItems: 'center' },
  counterNumber: { fontSize: 34, fontWeight: '700' },
  counterUnit: { fontSize: 13 },
  objectiveDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 4,
  },
  objectiveValue: { fontSize: 34, fontWeight: '700' },
  objectiveUnit: { fontSize: 16 },
  slider: { width: '100%', height: 40 },
  objectiveInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    textAlign: 'center',
    marginTop: 8,
    fontSize: 16,
  },
  saveBtn: {
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  saveBtnText: { color: 'white', fontSize: 17, fontWeight: '700' },
});

export default ActivitySaveDetailsModal;
