import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {colors} from '../theme';

export default function LoginScreen() {
  const {login} = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!username.trim() || !password) {
      setError('Please enter username and password.');
      return;
    }
    if (!login(username, password)) {
      setError('Invalid username or password.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Text style={styles.logo}>🎓</Text>
        <Text style={styles.title}>School Portal</Text>
        <Text style={styles.subtitle}>Sign in to manage students</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={t => {
            setUsername(t);
            setError('');
          }}
          placeholder="Enter username"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={t => {
            setPassword(t);
            setError('');
          }}
          placeholder="Enter password"
          placeholderTextColor={colors.muted}
          secureTextEntry
          onSubmitEditing={handleLogin}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>Demo: admin / admin123</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  header: {alignItems: 'center', marginBottom: 28},
  logo: {fontSize: 56},
  title: {fontSize: 28, fontWeight: '700', color: colors.primary, marginTop: 8},
  subtitle: {fontSize: 15, color: colors.muted, marginTop: 4},
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
  },
  label: {fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6},
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  error: {color: colors.danger, marginBottom: 12},
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {color: colors.white, fontSize: 16, fontWeight: '700'},
  hint: {textAlign: 'center', color: colors.muted, marginTop: 14, fontSize: 13},
});
