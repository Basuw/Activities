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
import ActivityDTO from '../../../dto/activities/ActivityDTO';
import UserModel from '../../../models/UserModel';
import { activityApiService } from '../../../services/ActivityApiService';

const ICONS = [
  'run-fast', 'swim', 'bike', 'weight-lifter', 'yoga', 'walk',
  'book-open-variant', 'music', 'food-apple', 'sleep',
  'pencil', 'basketball', 'soccer', 'tennis', 'code-braces',
  'heart-pulse', 'dumbbell', 'meditation', 'chess-queen', 'camera',
];

const CATEGORIES = ['Fitness', 'Health', 'Leisure', 'Learning', 'Mindfulness', 'Other'];

interface Props {
  isVisible: boolean;
  user: UserModel;
  onClose: () => void;
  onCreated: (activity: ActivityDTO) => void;
}

const CreateActivityModal: React.FC<Props> = ({ isVisible, user, onClose, onCreated }) => {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [unity, setUnity] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [icon, setIcon] = useState('star');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setName('');
    setUnity('');
    setDescription('');
    setCategory('');
    setIcon('star');
    setError('');
  };

  const handleCreate = async () => {
    if (!name.trim()) { setError('Name is required'); return; }
    if (!unity.trim()) { setError('Unit is required (e.g. km, pages, reps)'); return; }
    if (!category) { setError('Please select a category'); return; }
    setError('');
    setSaving(true);
    try {
      const created = await activityApiService.createActivity({
        name: name.trim(),
        description: description.trim(),
        unity: unity.trim(),
        icon,
        category,
        userId: user.id,
      });
      reset();
      onCreated(created);
    } catch (e) {
      setError('Failed to create activity. Check your connection.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={isVisible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: theme.background }]}>
          <View style={[styles.handle, { backgroundColor: theme.secondary }]} />

          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.foreground }]}>Create Activity</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialCommunityIcons name="close" size={24} color={theme.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Icon preview */}
            <View style={styles.iconPreviewRow}>
              <View style={[styles.iconPreviewCircle, { backgroundColor: `${theme.main}22` }]}>
                <MaterialCommunityIcons name={icon} size={44} color={theme.main} />
              </View>
              <Text style={[styles.iconPreviewHint, { color: theme.secondary }]}>
                Choose an icon below
              </Text>
            </View>

            {/* Icon picker */}
            <Text style={[styles.sectionLabel, { color: theme.secondary }]}>ICON</Text>
            <View style={[styles.card, { backgroundColor: theme.surface }]}>
              <View style={styles.iconsGrid}>
                {ICONS.map(ic => (
                  <TouchableOpacity
                    key={ic}
                    onPress={() => setIcon(ic)}
                    style={[
                      styles.iconOption,
                      { backgroundColor: theme.card },
                      icon === ic && { backgroundColor: theme.main },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={ic}
                      size={22}
                      color={icon === ic ? 'white' : theme.secondary}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Details */}
            <Text style={[styles.sectionLabel, { color: theme.secondary }]}>DETAILS</Text>
            <View style={[styles.card, { backgroundColor: theme.surface }]}>
              <Text style={[styles.fieldLabel, { color: theme.foreground }]}>Name *</Text>
              <TextInput
                style={[styles.input, { color: theme.foreground, borderColor: theme.border }]}
                placeholder="e.g. Morning Run"
                placeholderTextColor={theme.secondary}
                value={name}
                onChangeText={v => { setName(v); setError(''); }}
              />

              <Text style={[styles.fieldLabel, { color: theme.foreground }]}>Unit *</Text>
              <TextInput
                style={[styles.input, { color: theme.foreground, borderColor: theme.border }]}
                placeholder="e.g. km, pages, reps, min"
                placeholderTextColor={theme.secondary}
                value={unity}
                onChangeText={v => { setUnity(v); setError(''); }}
              />

              <Text style={[styles.fieldLabel, { color: theme.foreground }]}>Description</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  { color: theme.foreground, borderColor: theme.border },
                ]}
                placeholder="Optional description…"
                placeholderTextColor={theme.secondary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={2}
              />
            </View>

            {/* Category */}
            <Text style={[styles.sectionLabel, { color: theme.secondary }]}>CATEGORY *</Text>
            <View style={[styles.card, { backgroundColor: theme.surface }]}>
              <View style={styles.categoriesWrap}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => { setCategory(cat); setError(''); }}
                    style={[
                      styles.chip,
                      { borderColor: theme.main },
                      category === cat && { backgroundColor: theme.main },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: category === cat ? 'white' : theme.secondary },
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={[styles.input, { color: theme.foreground, borderColor: theme.border, marginTop: 14 }]}
                placeholder="Or type a custom category"
                placeholderTextColor={theme.secondary}
                value={category}
                onChangeText={v => { setCategory(v); setError(''); }}
              />
            </View>

            {error ? (
              <Text style={[styles.errorText, { color: theme.orange }]}>{error}</Text>
            ) : null}

            <TouchableOpacity
              onPress={handleCreate}
              disabled={saving}
              style={[styles.createBtn, { backgroundColor: theme.green }, saving && { opacity: 0.6 }]}
            >
              <MaterialCommunityIcons name="check-circle" size={20} color="white" />
              <Text style={styles.createBtnText}>{saving ? 'Creating…' : 'Create Activity'}</Text>
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
    maxHeight: SCREEN_HEIGHT * 0.92,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  title: { fontSize: 22, fontWeight: '700' },
  iconPreviewRow: { alignItems: 'center', marginBottom: 24, gap: 8 },
  iconPreviewCircle: {
    width: 80,
    height: 80,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPreviewHint: { fontSize: 13 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: { borderRadius: 18, padding: 16, marginBottom: 20 },
  iconsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  iconOption: {
    width: 46,
    height: 46,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldLabel: { fontSize: 14, fontWeight: '600', marginBottom: 6, marginTop: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    fontSize: 15,
    marginBottom: 4,
  },
  textArea: { height: 76, paddingTop: 12, textAlignVertical: 'top' },
  categoriesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipText: { fontSize: 13, fontWeight: '600' },
  errorText: { fontSize: 14, marginBottom: 12, textAlign: 'center' },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 18,
    gap: 8,
    marginTop: 4,
  },
  createBtnText: { color: 'white', fontSize: 17, fontWeight: '700' },
});

export default CreateActivityModal;
