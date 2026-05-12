import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import ActivitySaveDetailsModal from './ActivitySaveDetailsModal';
import CreateActivityModal from './CreateActivityModal';

interface Props {
  isVisible: boolean;
  user: UserModel;
  onClose: () => void;
  fetchActivitiesDone: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SelectActivitySaveModal: React.FC<Props> = ({ isVisible, user, onClose, fetchActivitiesDone }) => {
  const theme = useTheme();
  const [grouped, setGrouped] = useState<Record<string, ActivityDTO[]>>({});
  const [filtered, setFiltered] = useState<Record<string, ActivityDTO[]>>({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityDTO | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (isVisible) {
      loadActivities();
      setSearch('');
    }
  }, [isVisible]);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(grouped);
      return;
    }
    const q = search.toLowerCase();
    const result: Record<string, ActivityDTO[]> = {};
    Object.entries(grouped).forEach(([cat, acts]) => {
      const matches = acts.filter(a => a.name.toLowerCase().includes(q));
      if (matches.length > 0) result[cat] = matches;
    });
    setFiltered(result);
  }, [search, grouped]);

  const loadActivities = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await activityApiService.fetchAllActivities(user.id);
      const g = data.reduce((acc, a) => {
        if (!acc[a.category]) acc[a.category] = [];
        acc[a.category].push(a);
        return acc;
      }, {} as Record<string, ActivityDTO[]>);
      setGrouped(g);
    } catch (e) {
      console.error('Failed to load activities', e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  const handleSaved = () => {
    setSelectedActivity(null);
    fetchActivitiesDone();
    onClose();
  };

  const handleActivityCreated = () => {
    setShowCreate(false);
    loadActivities();
  };

  return (
    <>
      <Modal animationType="slide" transparent visible={isVisible} onRequestClose={onClose}>
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
          <View style={[styles.sheet, { backgroundColor: theme.background }]}>
            <View style={[styles.handle, { backgroundColor: theme.secondary }]} />

            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.foreground }]}>Add Activity</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <MaterialCommunityIcons name="close" size={24} color={theme.secondary} />
              </TouchableOpacity>
            </View>

            <View style={[styles.searchRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <MaterialCommunityIcons name="magnify" size={20} color={theme.secondary} />
              <TextInput
                style={[styles.searchInput, { color: theme.foreground }]}
                placeholder="Search activities…"
                placeholderTextColor={theme.secondary}
                value={search}
                onChangeText={setSearch}
                autoCorrect={false}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <MaterialCommunityIcons name="close-circle" size={18} color={theme.secondary} />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={[styles.createBtn, { backgroundColor: theme.main }]}
              onPress={() => setShowCreate(true)}
            >
              <MaterialCommunityIcons name="plus-circle-outline" size={20} color="white" />
              <Text style={styles.createBtnText}>Create New Activity</Text>
            </TouchableOpacity>

            <View style={styles.listArea}>
              {loading ? (
                <View style={styles.centered}>
                  <ActivityIndicator size="large" color={theme.main} />
                  <Text style={[styles.loadingText, { color: theme.secondary }]}>Loading activities…</Text>
                </View>
              ) : error ? (
                <View style={styles.centered}>
                  <MaterialCommunityIcons name="wifi-off" size={48} color={theme.secondary} />
                  <Text style={[styles.emptyText, { color: theme.foreground }]}>Cannot reach server</Text>
                  <Text style={[styles.emptyHint, { color: theme.secondary }]}>Make sure the backend is running</Text>
                  <TouchableOpacity
                    style={[styles.retryBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
                    onPress={loadActivities}
                  >
                    <MaterialCommunityIcons name="refresh" size={16} color={theme.main} />
                    <Text style={[styles.retryText, { color: theme.main }]}>Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : Object.keys(filtered).length === 0 ? (
                <View style={styles.centered}>
                  <MaterialCommunityIcons name="magnify-close" size={48} color={theme.secondary} />
                  <Text style={[styles.emptyText, { color: theme.secondary }]}>No activities found</Text>
                </View>
              ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                  {Object.entries(filtered).map(([category, acts]) => (
                    <View key={category} style={styles.section}>
                      <Text style={[styles.categoryLabel, { color: theme.secondary }]}>
                        {category.toUpperCase()}
                      </Text>
                      <View style={[styles.categoryCard, { backgroundColor: theme.surface }]}>
                        {acts.map((activity, idx) => (
                          <TouchableOpacity
                            key={activity.id}
                            style={[
                              styles.activityRow,
                              idx < acts.length - 1 && {
                                borderBottomWidth: StyleSheet.hairlineWidth,
                                borderBottomColor: theme.border,
                              },
                            ]}
                            onPress={() => setSelectedActivity(activity)}
                          >
                            <View style={[styles.iconWrap, { backgroundColor: `${theme.main}22` }]}>
                              <MaterialCommunityIcons name={activity.icon} size={20} color={theme.main} />
                            </View>
                            <Text style={[styles.activityName, { color: theme.foreground }]}>
                              {activity.name}
                            </Text>
                            <View style={[styles.unitBadge, { backgroundColor: theme.card }]}>
                              <Text style={[styles.unitText, { color: theme.secondary }]}>
                                {activity.unity}
                              </Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={18} color={theme.secondary} />
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {selectedActivity && (
        <ActivitySaveDetailsModal
          isVisible
          activity={selectedActivity}
          user={user}
          onClose={() => setSelectedActivity(null)}
          refreshActivities={handleSaved}
        />
      )}

      <CreateActivityModal
        isVisible={showCreate}
        user={user}
        onClose={() => setShowCreate(false)}
        onCreated={handleActivityCreated}
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    height: SCREEN_HEIGHT * 0.88,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 34,
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
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 16,
    gap: 8,
    marginBottom: 20,
  },
  createBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  listArea: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingBottom: 40,
  },
  loadingText: {
    fontSize: 14,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyHint: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  categoryCard: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  unitBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  unitText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default SelectActivitySaveModal;
