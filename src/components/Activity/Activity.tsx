import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'styled-components';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import LinearGradient from 'react-native-linear-gradient';
import ActivityProgressModel from '../../models/Activities/ActivityProgressModel';
import ActivityDoneDTO from '../../dto/activities/ActivityDoneDTO';
import { activityApiService } from '../../services/ActivityApiService';
import ActivityDoneEditModal from './EditActivityDone/ActivityDoneEditModal';

interface ActivityProps {
  activity: ActivityProgressModel;
  selectedDay: Date;
}

const Activity: React.FC<ActivityProps> = ({ activity, selectedDay }) => {
  const theme = useTheme();
  const [model, setModel] = useState(activity);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const swipeableRef = useRef<SwipeableMethods | null>(null);

  const progress = model.activityDone.activitySave.objective > 0
    ? Math.round((model.activityDone.achievement / model.activityDone.activitySave.objective) * 100)
    : 0;
  const isComplete = progress >= 100;

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

  const handleSwipeComplete = () => {
    if (!isComplete) {
      const updated = { ...model.activityDone, achievement: model.activityDone.activitySave.objective };
      createOrUpdate(updated);
    }
    setTimeout(() => swipeableRef.current?.close(), 600);
  };

  const handleSwipeableOpen = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      handleSwipeComplete();
    } else {
      setTimeout(() => swipeableRef.current?.close(), 2000);
    }
  };

  const renderLeftActions = () => (
    <LinearGradient
      colors={['#10B981', '#34D399']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.leftAction}
    >
      <MaterialCommunityIcons name="check-bold" size={28} color="white" />
      <Text style={styles.actionLabel}>Done!</Text>
    </LinearGradient>
  );

  const renderRightActions = () => (
    <View style={[styles.rightAction, { backgroundColor: theme.surface }]}>
      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#F59E0B' }]}>
        <MaterialCommunityIcons name="bell-outline" size={22} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#EF4444' }]}>
        <MaterialCommunityIcons name="trash-can-outline" size={22} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <ReanimatedSwipeable
        ref={swipeableRef}
        containerStyle={styles.swipeable}
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
        leftThreshold={80}
        rightThreshold={50}
        onSwipeableWillOpen={handleSwipeableOpen}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setEditModalVisible(true)}
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
      </ReanimatedSwipeable>

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
  swipeable: {
    borderRadius: 16,
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
  leftAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 24,
    gap: 8,
    borderRadius: 16,
  },
  actionLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  rightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionBtn: {
    width: 64,
    height: '100%' as any,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Activity;
