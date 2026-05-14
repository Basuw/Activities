import React, { useEffect, useState } from 'react';
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
import ActivitySaveModel from '../../../models/Activities/ActivitySaveModel';
import { activityApiService } from '../../../services/ActivityApiService';
import { CreateActivitySaveDTO } from '../../../dto/activities/CreateActivitySaveDTO';
import { UpdateActivitySaveDTO } from '../../../dto/activities/UpdateActivitySaveDTO';

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
  /** Modèle de base : activity, user, frequency, objective (id=0 si création) */
  activitySave: ActivitySaveModel;
  /** Saves existants pour ce groupe — jours déjà configurés, affichés en lecture seule */
  existingSaves?: ActivitySaveModel[];
  onClose: () => void;
  /** Appelé après le POST des nouveaux jours */
  refreshActivities?: () => void;
}

const ActivitySaveDetailsModal: React.FC<Props> = ({
  isVisible,
  activitySave,
  existingSaves = [],
  onClose,
  refreshActivities,
}) => {
  const theme = useTheme();

  const [draft, setDraft] = useState<ActivitySaveModel>({ ...activitySave });
  const [selectedDays, setSelectedDays] = useState<DayEnum[]>([]);
  const [saving, setSaving] = useState(false);

  // Resync uniquement à l'ouverture du modal (isVisible passe à true)
  // On ne met PAS activitySave/existingSaves dans les deps :
  // leur référence change à chaque render (new ActivitySaveModel / default [])
  // ce qui provoquerait une boucle infinie via setSelectedDays.
  useEffect(() => {
    if (isVisible) {
      setDraft({ ...activitySave });
      const days = existingSaves
        .map(s => s.day as DayEnum)
        .filter(Boolean);
      setSelectedDays(days);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const update = (patch: Partial<ActivitySaveModel>) =>
    setDraft(prev => ({ ...prev, ...patch }));

  const toggleDay = (day: DayEnum) =>
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day],
    );

  // ── Set des jours déjà en base (stable, recalculé si existingSaves change) ──
  const existingDaySet = new Set(
    existingSaves.map(s => s.day as DayEnum).filter(Boolean),
  );

  // ── Dérive les 3 listes à partir du diff existingSaves ↔ selectedDays ──────

  /** Saves à supprimer : existaient en base, leur jour n'est plus sélectionné */
  const toDelete = existingSaves.filter(
    s => s.day && !selectedDays.includes(s.day as DayEnum),
  );

  /** Jours à créer : sélectionnés mais pas encore en base */
  const toCreate = selectedDays.filter(d => !existingDaySet.has(d));

  /** Saves à mettre à jour : existaient en base, leur jour est toujours sélectionné */
  const toUpdate = existingSaves.filter(
    s => s.day && selectedDays.includes(s.day as DayEnum),
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const calls: Promise<unknown>[] = [];

      // ── Matching : jours décochés ↔ nouveaux jours cochés ──────────────────
      // Au lieu de DELETE + POST (qui casse le lien ActivityDone),
      // on PATCH le save existant avec le nouveau jour → le lien est préservé.
      const pendingDeletes = [...toDelete];
      const pendingCreates = [...toCreate];

      while (pendingDeletes.length > 0 && pendingCreates.length > 0) {
        const save    = pendingDeletes.shift()!;
        const newDay  = pendingCreates.shift()!;
        calls.push(activityApiService.updateActivitySave(save.id, {
          frequency: draft.frequency,
          objective: draft.objective,
          notes:     draft.notes,
          day:       newDay,              // jour changé, pas d'ID perdu
        }));
      }

      // ── PATCH — saves toujours cochés (freq / obj / notes mis à jour) ──────
      const baseUpdate: UpdateActivitySaveDTO = {
        frequency: draft.frequency,
        objective: draft.objective,
        notes:     draft.notes,
      };
      toUpdate.forEach(s =>
        calls.push(activityApiService.updateActivitySave(s.id, baseUpdate)),
      );

      // ── POST — nouveaux jours sans save existant à réutiliser ───────────────
      if (pendingCreates.length > 0) {
        const groupRef = draft.activitySaveGroupId
          ? { activitySaveGroup: { id: draft.activitySaveGroupId } }
          : {};
        const createList: CreateActivitySaveDTO[] = pendingCreates.map(day => ({
          frequency: draft.frequency,
          objective: draft.objective,
          notes:     draft.notes ?? '',
          activity:  { id: draft.activity.id },
          user:      { id: draft.user.id },
          day,
          ...groupRef,
        }));
        calls.push(activityApiService.createActivitySave(createList));
      }

      // ── Création sans aucun jour sélectionné (mode "any day") ───────────────
      if (existingSaves.length === 0 && selectedDays.length === 0) {
        const groupRef = draft.activitySaveGroupId
          ? { activitySaveGroup: { id: draft.activitySaveGroupId } }
          : {};
        calls.push(activityApiService.createActivitySave([{
          frequency: draft.frequency,
          objective: draft.objective,
          notes:     draft.notes ?? '',
          activity:  { id: draft.activity.id },
          user:      { id: draft.user.id },
          ...groupRef,
        }]));
      }

      // ── DELETE — saves sans remplacement (suppression pure) ─────────────────
      // Le FK est ON DELETE SET NULL → les ActivityDones conservent leur historique
      // mais perdent le lien vers le save supprimé.
      pendingDeletes.forEach(s =>
        calls.push(activityApiService.deleteActivitySave(s.id)),
      );

      await Promise.all(calls);
      refreshActivities?.();
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
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: theme.background }]}>
          <View style={[styles.handle, { backgroundColor: theme.secondary }]} />

          {/* Activity header */}
          <View style={styles.activityHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: `${theme.main}22` }]}>
              <MaterialCommunityIcons
                name={draft.activity.icon}
                size={32}
                color={theme.main}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.activityName, { color: theme.foreground }]}>
                {draft.activity.name}
              </Text>
              <Text style={[styles.activityCategory, { color: theme.secondary }]}>
                {draft.activity.category}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialCommunityIcons name="close" size={22} color={theme.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>

            {/* Schedule */}
            <Text style={[styles.sectionLabel, { color: theme.secondary }]}>SCHEDULE</Text>
            <View style={[styles.card, { backgroundColor: theme.surface }]}>
              <Text style={[styles.fieldLabel, { color: theme.foreground }]}>Days of the week</Text>
              <Text style={[styles.fieldHint, { color: theme.secondary }]}>
                {existingSaves.length > 0
                  ? 'Toggle days · red = will delete · green = will add'
                  : 'Leave empty to track on any day'}
              </Text>
              <View style={styles.daysRow}>
                {DAYS.map(({ short, full }) => {
                  const wasExisting = existingDaySet.has(full);
                  const isSelected = selectedDays.includes(full);
                  // will be deleted: was in base, now deselected
                  const willDelete = wasExisting && !isSelected;
                  // will be created: not in base, now selected
                  const willCreate = !wasExisting && isSelected;
                  // kept/updated: was in base, still selected
                  const kept = wasExisting && isSelected;

                  return (
                    <TouchableOpacity
                      key={short}
                      onPress={() => toggleDay(full)}
                      activeOpacity={0.7}
                      style={[
                        styles.dayBtn,
                        kept     && { backgroundColor: theme.main,   borderColor: theme.main },
                        willCreate && { backgroundColor: theme.green,  borderColor: theme.green },
                        willDelete && { borderColor: theme.orange, borderStyle: 'dashed' },
                        !wasExisting && !isSelected && { borderColor: theme.border },
                      ]}>
                      <Text style={[
                        styles.dayText,
                        { color: (kept || willCreate) ? 'white'
                                : willDelete          ? theme.orange
                                : theme.secondary },
                      ]}>
                        {short}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Frequency */}
            <Text style={[styles.sectionLabel, { color: theme.secondary }]}>FREQUENCY</Text>
            <View style={[styles.card, { backgroundColor: theme.surface }]}>
              <View style={styles.counterRow}>
                <TouchableOpacity
                  onPress={() => update({ frequency: Math.max(1, draft.frequency - 1) })}
                  style={[styles.counterBtn, { backgroundColor: theme.card }]}>
                  <MaterialCommunityIcons name="minus" size={20} color={theme.main} />
                </TouchableOpacity>
                <View style={styles.counterDisplay}>
                  <Text style={[styles.counterNumber, { color: theme.foreground }]}>
                    {draft.frequency}
                  </Text>
                  <Text style={[styles.counterUnit, { color: theme.secondary }]}>times / week</Text>
                </View>
                <TouchableOpacity
                  onPress={() => update({ frequency: draft.frequency + 1 })}
                  style={[styles.counterBtn, { backgroundColor: theme.card }]}>
                  <MaterialCommunityIcons name="plus" size={20} color={theme.main} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Objective */}
            <Text style={[styles.sectionLabel, { color: theme.secondary }]}>OBJECTIVE</Text>
            <View style={[styles.card, { backgroundColor: theme.surface }]}>
              <View style={styles.objectiveDisplay}>
                <Text style={[styles.objectiveValue, { color: theme.foreground }]}>
                  {draft.objective}
                </Text>
                <Text style={[styles.objectiveUnit, { color: theme.secondary }]}>
                  {draft.activity.unity}
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={50}
                step={1}
                value={draft.objective}
                onValueChange={v => update({ objective: Math.round(v) })}
                minimumTrackTintColor={theme.main}
                maximumTrackTintColor={theme.border}
                thumbTintColor={theme.main}
              />
              <TextInput
                style={[styles.objectiveInput, { color: theme.foreground, borderColor: theme.border }]}
                keyboardType="numeric"
                value={String(draft.objective)}
                onChangeText={v => {
                  const n = parseInt(v, 10);
                  if (!isNaN(n) && n > 0) update({ objective: n });
                }}
              />
            </View>

            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              style={[styles.saveBtn, { backgroundColor: theme.main }, saving && { opacity: 0.6 }]}>
              <Text style={styles.saveBtnText}>
                {saving ? 'Saving…' : 'Add Activity'}
              </Text>
            </TouchableOpacity>

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
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    alignSelf: 'center', marginTop: 12, marginBottom: 6,
  },
  activityHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16,
  },
  iconWrapper: {
    width: 56, height: 56, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  activityName: { fontSize: 20, fontWeight: '700' },
  activityCategory: { fontSize: 14, marginTop: 2 },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginBottom: 8, marginLeft: 4,
  },
  card: { borderRadius: 18, padding: 16, marginBottom: 20 },
  fieldLabel: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  fieldHint: { fontSize: 12, marginBottom: 14 },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayBtn: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1.5,
  },
  dayText: { fontSize: 12, fontWeight: '600' },
  counterRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  counterBtn: {
    width: 48, height: 48, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  counterDisplay: { alignItems: 'center' },
  counterNumber: { fontSize: 34, fontWeight: '700' },
  counterUnit: { fontSize: 13 },
  objectiveDisplay: {
    flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 4,
  },
  objectiveValue: { fontSize: 34, fontWeight: '700' },
  objectiveUnit: { fontSize: 16 },
  slider: { width: '100%', height: 40 },
  objectiveInput: {
    borderWidth: 1, borderRadius: 12, paddingHorizontal: 12,
    height: 44, textAlign: 'center', marginTop: 8, fontSize: 16,
  },
  saveBtn: {
    height: 56, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center', marginTop: 4,
  },
  saveBtnText: { color: 'white', fontSize: 17, fontWeight: '700' },
});

export default ActivitySaveDetailsModal;
