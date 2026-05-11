import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'styled-components';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolateColor,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import ActivityProgressModel from '../../models/Activities/ActivityProgressModel';
import ActivityDoneDTO from '../../dto/activities/ActivityDoneDTO';
import StatusEnum from '../../models/Activities/StatusEnum';
import { activityApiService } from '../../services/ActivityApiService';
import ActivityDoneEditModal from './EditActivityDone/ActivityDoneEditModal';

interface ActivityProps {
  activity: ActivityProgressModel;
  selectedDay: Date;
}

const SWIPE_X_THRESHOLD = 90;  // horizontal trigger distance
const SWIPE_Y_THRESHOLD = 60;  // downward trigger distance

const Activity: React.FC<ActivityProps> = ({ activity, selectedDay }) => {
  const theme = useTheme();
  const [model, setModel] = useState(activity);
  const [isEditModalVisible, setEditModalVisible] = useState(false);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const progress = model.activityDone.activitySave.objective > 0
    ? Math.round((model.activityDone.achievement / model.activityDone.activitySave.objective) * 100)
    : 0;
  const isComplete = progress >= 100;

  // ─── API ───────────────────────────────────────────────────────────────────

  const createOrUpdate = async (updated: ActivityDoneDTO) => {
    updated.doneOn = selectedDay;
    try {
      const result = updated.id <= 0
        ? await activityApiService.postActivityDone(updated)
        : await activityApiService.patchActivityDone(updated);
      setModel(result);
    } catch (e) {
      console.error('Error updating activity:', e);
    }
  };

  const handleSave = (updated: ActivityDoneDTO) => {
    setModel(prev => ({ ...prev, activityDone: updated }));
    createOrUpdate(updated);
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

  const handleDelay = () => {
    console.log('delay');
  };

  const openEditModal = () => setEditModalVisible(true);

  // ─── Gestures ──────────────────────────────────────────────────────────────

  /**
   * Horizontal pan:
   *   right (+X) → validate (green)
   *   left  (-X) → cancel  (red)
   * failOffsetY prevents activation when swiping vertically.
   */
  const panX = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-20, 20])
    .onUpdate(e => {
      translateX.value = e.translationX;
      translateY.value = 0;
    })
    .onEnd(e => {
      if (e.translationX > SWIPE_X_THRESHOLD) {
        runOnJS(handleValidate)();
      } else if (e.translationX < -SWIPE_X_THRESHOLD) {
        runOnJS(handleCancel)();
      }
      translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
    });

  /**
   * Vertical pan (downward only):
   *   down (+Y) → delay (orange)
   * failOffsetX prevents activation when swiping horizontally.
   */
  const panY = Gesture.Pan()
    .activeOffsetY([-9999, 20])
    .failOffsetX([-20, 20])
    .onUpdate(e => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
      translateX.value = 0;
    })
    .onEnd(e => {
      if (e.translationY > SWIPE_Y_THRESHOLD) {
        runOnJS(handleDelay)();
      }
      translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
    });

  // Race: first gesture to activate wins, cancels the other
  const gesture = Gesture.Race(panX, panY);

  // ─── Animated styles ───────────────────────────────────────────────────────

  /** Card slides with finger */
  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  /**
   * Background behind card:
   *   translateX > 0  → green  (validate)
   *   translateX < 0  → red    (cancel)
   *   translateY > 0  → orange (delay)
   */
  const bgStyle = useAnimatedStyle(() => {
    const ax = Math.abs(translateX.value);
    const ay = translateY.value > 0 ? translateY.value : 0;

    if (ax < 5 && ay < 5) return { backgroundColor: 'transparent' };

    if (ax >= ay) {
      // Horizontal dominant
      if (translateX.value > 0) {
        // green
        const opacity = interpolate(translateX.value, [0, 40], [0, 1], Extrapolation.CLAMP);
        return { backgroundColor: `rgba(16,185,129,${opacity})` };
      } else {
        // red
        const opacity = interpolate(-translateX.value, [0, 40], [0, 1], Extrapolation.CLAMP);
        return { backgroundColor: `rgba(239,68,68,${opacity})` };
      }
    } else {
      // Vertical dominant (down)
      const opacity = interpolate(translateY.value, [0, 40], [0, 1], Extrapolation.CLAMP);
      return { backgroundColor: `rgba(245,158,11,${opacity})` };
    }
  });

  /** Green icon/label — left side, visible when swiping right */
  const greenIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [10, 50], [0, 1], Extrapolation.CLAMP),
  }));

  /** Red icon/label — right side, visible when swiping left */
  const redIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(-translateX.value, [10, 50], [0, 1], Extrapolation.CLAMP),
  }));

  /** Orange icon/label — center, visible when swiping down */
  const orangeIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [10, 50], [0, 1], Extrapolation.CLAMP),
  }));

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <View style={styles.wrapper}>
      <GestureDetector gesture={gesture}>
        {/* Outer container: clips card to rounded corners, holds the bg */}
        <View style={styles.container}>

          {/* ── Colored background (absoluteFill, behind card) ── */}
          <Animated.View style={[StyleSheet.absoluteFill, styles.bg, bgStyle]}>
            {/* Green: check — left side */}
            <Animated.View style={[styles.bgLeft, greenIconStyle]}>
              <MaterialCommunityIcons name="check-bold" size={26} color="white" />
              <Text style={styles.bgLabel}>Done!</Text>
            </Animated.View>

            {/* Red: cancel — right side */}
            <Animated.View style={[styles.bgRight, redIconStyle]}>
              <Text style={styles.bgLabel}>Annuler</Text>
              <MaterialCommunityIcons name="close-circle-outline" size={26} color="white" />
            </Animated.View>

            {/* Orange: delay — center */}
            <Animated.View style={[styles.bgCenter, orangeIconStyle]}>
              <Text style={styles.bgEmoji}>⏰</Text>
              <Text style={styles.bgLabel}>Delay</Text>
            </Animated.View>
          </Animated.View>

          {/* ── Card (slides on top of background) ── */}
          <Animated.View style={cardStyle}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={openEditModal}
              style={[styles.card, { backgroundColor: theme.surface }]}
            >
              {/* Progress bar */}
              <View style={[styles.progressBar, { backgroundColor: theme.card }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(progress, 100)}%` as any,
                      backgroundColor: isComplete ? theme.green : theme.purple,
                    },
                  ]}
                />
              </View>

              <View style={styles.row}>
                {/* Icon */}
                <View style={[styles.iconWrap, { backgroundColor: `${isComplete ? theme.green : theme.purple}22` }]}>
                  <MaterialCommunityIcons
                    name={model.activityDone.activitySave.activity.icon}
                    size={24}
                    color={isComplete ? theme.green : theme.purple}
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
                    <View style={[styles.badge, { backgroundColor: isComplete ? `${theme.green}22` : `${theme.purple}22` }]}>
                      <Text style={[styles.badgeText, { color: isComplete ? theme.green : theme.purple }]}>
                        {progress}%
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
  bgCenter: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  bgLabel: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
  bgEmoji: {
    fontSize: 22,
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
