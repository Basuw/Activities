import React  from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';

const Profil = () => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <Text>Profil page</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'lightgrey',
    flex: 1,
  },
});

export default Profil;
