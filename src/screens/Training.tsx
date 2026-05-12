import React from 'react';
import {Text, SafeAreaView} from 'react-native';
import { useTheme } from 'styled-components';
import UserModel from '../models/UserModel.ts';

interface Props {
  user: UserModel;
  onLogout: () => void;
}

const Training: React.FC<Props> = ({ user, onLogout }) => {
  const theme = useTheme();
  return(
      <SafeAreaView style={[{ backgroundColor: theme.background }]}>
        <Text>
          Blabla
        </Text>
      </SafeAreaView>
    );
};

export default Training;
