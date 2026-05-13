import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'styled-components';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from '../Icon';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import ActivityProgressModel from '../../models/Activities/ActivityProgressModel';
import ActivityDoneDTO from '../../dto/activities/ActivityDoneDTO';
import StatusEnum from '../../models/Activities/StatusEnum';
import { activityApiService } from '../../services/ActivityApiService';
import ActivityDoneEditModal from './EditActivityDone/ActivityDoneEditModal';
import ActivitySaveDetailsModal from './AddActivitySave/ActivitySaveDetailsModal';
import DelayActionSheet, { DelayOption } from './DelayActionSheet';
import ActivitySaveModel from '../../models/Activities/ActivitySaveModel';
import UserModel from '../../models/UserModel';
import { CreateActivityDoneDTO } from '../../dto/activities/CreateActivityDoneDTO';
import { UpdateActivityDoneDTO } from '../../dto/activities/UpdateActivityDoneDTO';

interface ActivityProps {
  activity: ActivityProgressModel;
  selectedDay: Date;
}

const SWIPE_RIGHT_THRESHOLD = 90;
const SWIPE_LEFT_THRESHOLD  = 90;

const Activity: React.FC<ActivityProps> = ({ activity, selectedDay }) => {
  const theme = useTheme();
  const [model, setModel] = useState(activity);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isSaveEditModalVisible, setSaveEditModalVisible] = useState(false);
  const [groupSaves, setGroupSaves] = useState<ActivitySaveModel[]>([]);
  const [isDelaySheetVisible, setDelaySheetVisible] = useState(false);

  const translateX = useSharedValue(0);

  const progress = model.activityDone.activitySave.objective > 0
    ? Math.round((model.activityDone.achievement / model.activityDone.activitySave.objective) * 100)
    : 0;
  const isComplete  = progress >= 100 || model.activityDone.status === StatusEnum.COMPLETED;
  const isCancelled = model.activityDone.status === StatusEnum.CANCELLED;

  // Couleur dominante de la carte
  const cardColor = isComplete ? theme.green : isCancelled ? theme.orange : theme.main;

  // ─── API ───────────────────────────────────────────────────────────────────

  const createOrUpdate = async (updated: ActivityDoneDTO) => {
    const status =
      updated.achievement === updated.activitySave.objective
        ? StatusEnum.COMPLETED
        : updated.achievement !== 0
        ? StatusEnum.IN_PROGRESS
        : updated.status;

    try {
      let result: ActivityProgressModel;

      if (updated.id <= 0) {
        const dto: CreateActivityDoneDTO = {
          achievement: updated.achievement,
          mark: updated.mark,
          notes: updated.notes,
          activitySave: { id: updated.activitySave.id },
          status: status as StatusEnum,
          doneOn: selectedDay,
          duration: updated.duration,
        };
        result = await activityApiService.createActivityDone(dto, updated.activitySave);
      } else {
        const dto: UpdateActivityDoneDTO = {
          achievement: updated.achievement,
          status,
          mark: updated.mark,
          notes: updated.notes,
          doneOn: selectedDay,
          duration: updated.duration,
        };
        result = await activityApiService.updateActivityDone(updated.id, dto, updated.activitySave);
      }

      setModel(result);
    } catch (e) {
      console.error('Error updating activity:', e);
    }
  };

  const handleSave = (updated: ActivityDoneDTO) => {
    setModel(prev => ({ ...prev, activityDone: updated }));
    createOrUpdate(updated);
  };

  const handleOpenSaveEdit = async () => {
    const groupId = model.activityDone.activitySave.activitySaveGroupId;
    if (groupId != null) {
      try {
        const saves = await activityApiService.fetchSavesByGroupId(groupId);
        setGroupSaves(saves);
      } catch (e) {
        console.error('Failed to fetch group saves:', e);
        setGroupSaves([]);
      }
    } else {
      setGroupSaves([]);
    }
    setSaveEditModalVisible(true);
  };

  const handleSaveEditClose = () => {
    setSaveEditModalVisible(false);
    setGroupSaves([]);
  };

  /** Convertit l'ActivitySaveDTO courant en ActivitySaveModel pour le modal */
  const currentSaveAsModel = (): ActivitySaveModel => {
    const s = model.activityDone.activitySave;
    return new ActivitySaveModel(
      s.id,
      s.frequency,
      s.objective,
      new Date(),
      s.activity,
      '',
      '',
      { id: s.userId } as UserModel,
    );
  };

  const handleValidate = () => {
    createOrUpdate({
      ...model.activityDone,
      achievement: model.activityDone.activitySave.objective,
      status: StatusEnum.COMPLETED,
    });
  };

  const handleCancel = () => {
    if (model.activityDone.id > 0) {
      createOrUpdate({
        ...model.activityDone,
        achievement: 0,
        status: StatusEnum.CANCELLED,
      });
    }
  };

  const handleDelayOption = (option: DelayOption) => {
    setDelaySheetVisible(false);
    // TODO: implement backend scheduling
    console.log('delay:', option);
  };

  const openEditModal  = () => setEditModalVisible(true);
  const openDelaySheet = () => setDelaySheetVisible(true);

  // ─── Gesture ───────────────────────────────────────────────────────────────

  const gesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-20, 20])
    .onUpdate(e => {
      translateX.value = e.translationX;
    })
    .onEnd(e => {
      if (e.translationX > SWIPE_RIGHT_THRESHOLD) {
        runOnJS(handleValidate)();
      } else if (e.translationX < -SWIPE_LEFT_THRESHOLD) {
        runOnJS(handleCancel)();
      }
      translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
    });

  // ─── Animated styles ───────────────────────────────────────────────────────

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const bgStyle = useAnimatedStyle(() => {
    const x = translateX.value;
    if (x > 5) {
      const op = interpolate(x, [5, 50], [0, 1], Extrapolation.CLAMP);
      return { backgroundColor: `rgba(16,185,129,${op})` };
    }
    if (x < -5) {
      const op = interpolate(-x, [5, 50], [0, 1], Extrapolation.CLAMP);
      return { backgroundColor: `rgba(239,68,68,${op})` };
    }
    return { backgroundColor: 'transparent' };
  });

  const greenIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [10, 55], [0, 1], Extrapolation.CLAMP),
  }));

  const redIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(-translateX.value, [10, 55], [0, 1], Extrapolation.CLAMP),
  }));

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <View style={styles.wrapper}>
      <GestureDetector gesture={gesture}>
        <View style={styles.container}>

          {/* Colored background behind card */}
          <Animated.View style={[StyleSheet.absoluteFill, styles.bg, bgStyle]}>
            {/* Green — swipe right */}
            <Animated.View style={[styles.bgLeft, greenIconStyle]}>
              <Icon sfSymbol="checkmark" androidIcon="check-bold" size={26} color="white" />
              <Text style={styles.bgLabel}>Done!</Text>
            </Animated.View>
            {/* Red — swipe left */}
            <Animated.View style={[styles.bgRight, redIconStyle]}>
              <Text style={styles.bgLabel}>Annuler</Text>
              <Icon sfSymbol="xmark.circle" androidIcon="close-circle-outline" size={26} color="white" />
            </Animated.View>
          </Animated.View>

          {/* Card */}
          <Animated.View style={cardStyle}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={openEditModal}
              onLongPress={openDelaySheet}
              delayLongPress={400}
              style={[styles.card, { backgroundColor: theme.surface }]}
            >
              {/* Progress bar */}
              <View style={[styles.progressBar, { backgroundColor: theme.card }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: isCancelled ? '100%' : `${Math.min(progress, 100)}%` as any,
                      backgroundColor: cardColor,
                    },
                  ]}
                />
              </View>

              <View style={styles.row}>
                {/* Icon */}
                <View style={[styles.iconWrap, { backgroundColor: `${cardColor}22` }]}>
                  <MaterialCommunityIcons
                    name={model.activityDone.activitySave.activity.icon}
                    size={24}
                    color={cardColor}
                  />
                </View>

                {/* Info */}
                <View style={styles.info}>
                  <Text style={[styles.name, { color: theme.foreground }]} numberOfLines={1}>
                    {model.activityDone.activitySave.activity.name}
                  </Text>
                  <View style={styles.statsRow}>
                    <Text style={[styles.stat, { color: theme.secondary }]}>
                      Week: {model.weekObjective}/{model.activityDone.activitySave.frequency}
                    </Text>
                    <View style={[styles.badge, { backgroundColor: `${cardColor}22` }]}>
                      <Text style={[styles.badgeText, { color: cardColor }]}>
                        {isCancelled ? '✕' : `${progress}%`}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Score */}
                <View style={styles.score}>
                  <Text style={[styles.achievement, { color: theme.foreground }]}>
                    {model.activityDone.achievement}
                  </Text>
                  <Text style={[styles.objective, { color: theme.secondary }]}>
                    /{model.activityDone.activitySave.objective}
                  </Text>
                  <Text style={[styles.unity, { color: theme.secondary }]}>
                    {model.activityDone.activitySave.activity.unity}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

        </View>
      </GestureDetector>

      <ActivityDoneEditModal
        isVisible={isEditModalVisible}
        activity={model.activityDone}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSave}
        onEditModel={handleOpenSaveEdit}
      />

      <ActivitySaveDetailsModal
        isVisible={isSaveEditModalVisible}
        activitySave={currentSaveAsModel()}
        existingSaves={groupSaves}
        onClose={handleSaveEditClose}
        refreshActivities={() => {
          setSaveEditModalVisible(false);
          setGroupSaves([]);
        }}
      />

      <DelayActionSheet
        isVisible={isDelaySheetVisible}
        activityName={model.activityDone.activitySave.activity.name}
        onSelect={handleDelayOption}
        onClose={() => setDelaySheetVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 8,
  },
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  bg: {
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bgLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    gap: 10,
  },
  bgRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 20,
    gap: 10,
  },
  bgLabel: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: 3,
    width: '100%',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stat: {
    fontSize: 12,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  score: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 1,
  },
  achievement: {
    fontSize: 20,
    fontWeight: '700',
  },
  objective: {
    fontSize: 14,
  },
  unity: {
    fontSize: 11,
    marginLeft: 2,
  },
});

export default Activity;
