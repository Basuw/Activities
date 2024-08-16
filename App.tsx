import {View, StyleSheet} from 'react-native';
import React from 'react';
import Activities from './src/screens/Activities.tsx';
const app = () => {
  return (
    <View style={styles.container}>
      <Activities />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default app;
