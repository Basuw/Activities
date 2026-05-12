import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from 'styled-components';
import Icon from '../Icon';

export type DelayOption = '1h' | 'tomorrow' | 'skip';

interface Props {
  isVisible: boolean;
  activityName: string;
  onSelect: (option: DelayOption) => void;
  onClose: () => void;
}

const OPTIONS: {
  key: DelayOption;
  sfSymbol: string;
  androidIcon: string;
  label: string;
  sublabel: string;
  color: string;
}[] = [
  {
    key: '1h',
    sfSymbol: 'clock',
    androidIcon: 'clock-outline',
    label: 'Dans 1 heure',
    sublabel: 'Je m\'y mets plus tard aujourd\'hui',
    color: '#7C3AED',
  },
  {
    key: 'tomorrow',
    sfSymbol: 'calendar.badge.plus',
    androidIcon: 'calendar-arrow-right',
    label: 'Demain',
    sublabel: 'Reporter à demain',
    color: '#2563EB',
  },
  {
    key: 'skip',
    sfSymbol: 'xmark.circle',
    androidIcon: 'close-circle-outline',
    label: 'Passer aujourd\'hui',
    sublabel: 'Ne pas comptabiliser cette séance',
    color: '#EF4444',
  },
];

const DelayActionSheet: React.FC<Props> = ({
  isVisible,
  activityName,
  onSelect,
  onClose,
}) => {
  const theme = useTheme();

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={[styles.sheet, { backgroundColor: theme.background }]}>
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: theme.secondary }]} />

          {/* Header */}
          <View style={styles.header}>
            <Icon sfSymbol="timer" androidIcon="clock-fast" size={20} color={theme.secondary} />
            <Text style={[styles.headerTitle, { color: theme.secondary }]}>
              Reporter · {activityName}
            </Text>
          </View>

          {/* Options */}
          <View style={[styles.optionsCard, { backgroundColor: theme.surface }]}>
            {OPTIONS.map((opt, idx) => (
              <React.Fragment key={opt.key}>
                {idx > 0 && (
                  <View style={[styles.separator, { backgroundColor: theme.border }]} />
                )}
                <TouchableOpacity
                  style={styles.optionRow}
                  activeOpacity={0.7}
                  onPress={() => onSelect(opt.key)}
                >
                  <View style={[styles.iconWrap, { backgroundColor: `${opt.color}18` }]}>
                    <Icon sfSymbol={opt.sfSymbol} androidIcon={opt.androidIcon} size={22} color={opt.color} />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={[styles.optionLabel, { color: theme.foreground }]}>
                      {opt.label}
                    </Text>
                    <Text style={[styles.optionSub, { color: theme.secondary }]}>
                      {opt.sublabel}
                    </Text>
                  </View>
                  <Icon sfSymbol="chevron.right" androidIcon="chevron-right" size={18} color={theme.secondary} />
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>

          {/* Cancel button */}
          <TouchableOpacity
            style={[styles.cancelBtn, { backgroundColor: theme.surface }]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={[styles.cancelText, { color: theme.foreground }]}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingBottom: 34,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  optionsCard: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionSub: {
    fontSize: 13,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 72,
  },
  cancelBtn: {
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DelayActionSheet;
