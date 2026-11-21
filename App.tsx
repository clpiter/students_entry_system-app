/**
 * School portal: login + student management (CRUD).
 *
 * @format
 */

import React, {useState} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {AuthProvider, useAuth} from './src/context/AuthContext';
import {StudentProvider} from './src/context/StudentContext';
import LoginScreen from './src/screens/LoginScreen';
import StudentFormScreen from './src/screens/StudentFormScreen';
import StudentListScreen from './src/screens/StudentListScreen';
import {colors} from './src/theme';

type Screen = {name: 'list'} | {name: 'form'; studentId?: string};

function Main() {
  const {user} = useAuth();
  const [screen, setScreen] = useState<Screen>({name: 'list'});

  if (!user) {
    return <LoginScreen />;
  }

  if (screen.name === 'form') {
    return (
      <StudentFormScreen
        key={screen.studentId ?? 'new'}
        studentId={screen.studentId}
        onDone={() => setScreen({name: 'list'})}
      />
    );
  }

  return (
    <StudentListScreen
      onAdd={() => setScreen({name: 'form'})}
      onEdit={id => setScreen({name: 'form', studentId: id})}
    />
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.root}>
        <AuthProvider>
          <StudentProvider>
            <Main />
          </StudentProvider>
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.background},
});

export default App;
