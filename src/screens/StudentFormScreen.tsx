import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import {useStudents} from '../context/StudentContext';
import {colors} from '../theme';
import {StudentInput} from '../types';

type Props = {
  studentId?: string;
  onDone: () => void;
};

type Errors = Partial<Record<keyof StudentInput, string>>;

const EMPTY: StudentInput = {
  name: '',
  rollNo: '',
  className: '',
  email: '',
  phone: '',
};

export default function StudentFormScreen({studentId, onDone}: Props) {
  const {students, addStudent, updateStudent, getStudent} = useStudents();
  const existing = studentId ? getStudent(studentId) : undefined;
  const isEdit = Boolean(existing);

  const [form, setForm] = useState<StudentInput>(() => {
    if (!existing) {
      return EMPTY;
    }
    return {
      name: existing.name,
      rollNo: existing.rollNo,
      className: existing.className,
      email: existing.email,
      phone: existing.phone,
    };
  });
  const [errors, setErrors] = useState<Errors>({});

  const setField = (key: keyof StudentInput, value: string) => {
    setForm(prev => ({...prev, [key]: value}));
    setErrors(prev => ({...prev, [key]: undefined}));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.name.trim()) {
      e.name = 'Name is required';
    }
    if (!form.rollNo.trim()) {
      e.rollNo = 'Roll number is required';
    } else if (
      students.some(
        s =>
          s.id !== studentId &&
          s.rollNo.trim() === form.rollNo.trim() &&
          s.className.trim().toLowerCase() === form.className.trim().toLowerCase(),
      )
    ) {
      e.rollNo = 'Roll number already exists in this class';
    }
    if (!form.className.trim()) {
      e.className = 'Class is required';
    }
    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      e.email = 'Enter a valid email';
    }
    if (form.phone.trim() && !/^[0-9+\-\s]{7,15}$/.test(form.phone.trim())) {
      e.phone = 'Enter a valid phone number';
    }
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    const cleaned: StudentInput = {
      name: form.name.trim(),
      rollNo: form.rollNo.trim(),
      className: form.className.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };
    if (isEdit && studentId) {
      updateStudent(studentId, cleaned);
    } else {
      addStudent(cleaned);
    }
    onDone();
  };

  const field = (
    key: keyof StudentInput,
    label: string,
    props: TextInputProps = {},
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, errors[key] ? styles.inputError : null]}
        value={form[key]}
        onChangeText={v => setField(key, v)}
        placeholderTextColor={colors.muted}
        {...props}
      />
      {errors[key] ? <Text style={styles.error}>{errors[key]}</Text> : null}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onDone}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{isEdit ? 'Edit Student' : 'Add Student'}</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {field('name', 'Full Name *', {placeholder: 'e.g. Ali Khan'})}
        {field('rollNo', 'Roll Number *', {
          placeholder: 'e.g. 101',
          keyboardType: 'number-pad',
        })}
        {field('className', 'Class *', {placeholder: 'e.g. 10-A'})}
        {field('email', 'Email', {
          placeholder: 'student@school.edu',
          keyboardType: 'email-address',
          autoCapitalize: 'none',
        })}
        {field('phone', 'Phone', {
          placeholder: '03001234567',
          keyboardType: 'phone-pad',
        })}

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>
            {isEdit ? 'Update Student' : 'Save Student'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  topBar: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {color: colors.white, fontSize: 16, fontWeight: '600', width: 60},
  title: {color: colors.white, fontSize: 18, fontWeight: '700'},
  spacer: {width: 60},
  content: {padding: 16},
  field: {marginBottom: 14},
  label: {fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6},
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  inputError: {borderColor: colors.danger},
  error: {color: colors.danger, fontSize: 13, marginTop: 4},
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {color: colors.white, fontSize: 16, fontWeight: '700'},
});
