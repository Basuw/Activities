import React  from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';

const Profil = () => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <Text>Profil page</Text>
      <Image
          source={require('../../assets/icons/activities/running.png')} style={styles.image}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'lightgrey',
    flex: 1,
  }, image: {
    width: 100,
    },

});

export default Profil;
