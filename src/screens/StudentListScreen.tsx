import React, {useMemo, useState} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {useStudents} from '../context/StudentContext';
import {colors} from '../theme';
import {Student} from '../types';

type Props = {
  onAdd: () => void;
  onEdit: (id: string) => void;
};

export default function StudentListScreen({onAdd, onEdit}: Props) {
  const {user, logout} = useAuth();
  const {students, deleteStudent} = useStudents();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return students;
    }
    return students.filter(
      s =>
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.className.toLowerCase().includes(q),
    );
  }, [students, query]);

  const confirmDelete = (student: Student) => {
    Alert.alert('Delete student', `Delete ${student.name}?`, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteStudent(student.id),
      },
    ]);
  };

  const confirmLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Logout', onPress: logout},
    ]);
  };

  const renderItem = ({item}: {item: Student}) => (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>
          Roll #{item.rollNo} · Class {item.className}
        </Text>
        {item.email ? <Text style={styles.meta}>{item.email}</Text> : null}
        {item.phone ? <Text style={styles.meta}>{item.phone}</Text> : null}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.smallBtn, styles.editBtn]}
          onPress={() => onEdit(item.id)}>
          <Text style={styles.smallBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.smallBtn, styles.deleteBtn]}
          onPress={() => confirmDelete(item)}>
          <Text style={styles.smallBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.welcome}>Welcome, {user?.name}</Text>
          <Text style={styles.count}>{students.length} students</Text>
        </View>
        <TouchableOpacity onPress={confirmLogout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.search}
        value={query}
        onChangeText={setQuery}
        placeholder="Search by name, roll no or class"
        placeholderTextColor={colors.muted}
      />

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {query ? 'No matching students.' : 'No students yet. Tap + to add.'}
          </Text>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={onAdd}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  topBar: {
    backgroundColor: colors.primary,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcome: {color: colors.white, fontSize: 18, fontWeight: '700'},
  count: {color: '#cfe0f7', marginTop: 2},
  logout: {color: colors.white, fontWeight: '600', fontSize: 15},
  search: {
    backgroundColor: colors.card,
    margin: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
  },
  list: {padding: 16, paddingTop: 8, paddingBottom: 96},
  card: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 1},
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {color: colors.white, fontSize: 18, fontWeight: '700'},
  info: {flex: 1},
  name: {fontSize: 16, fontWeight: '700', color: colors.text},
  meta: {fontSize: 13, color: colors.muted, marginTop: 2},
  actions: {marginLeft: 8},
  smallBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginVertical: 3,
    alignItems: 'center',
  },
  editBtn: {backgroundColor: colors.primary},
  deleteBtn: {backgroundColor: colors.danger},
  smallBtnText: {color: colors.white, fontSize: 13, fontWeight: '600'},
  empty: {textAlign: 'center', color: colors.muted, marginTop: 40},
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
  },
  fabText: {color: colors.white, fontSize: 30, lineHeight: 32},
});
