import React, {createContext, useContext, useState} from 'react';
import {Student, StudentInput} from '../types';

const SAMPLE_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Ali Khan',
    rollNo: '101',
    className: '10-A',
    email: 'ali.khan@school.edu',
    phone: '03001234567',
  },
  {
    id: '2',
    name: 'Sara Ahmed',
    rollNo: '102',
    className: '10-A',
    email: 'sara.ahmed@school.edu',
    phone: '03007654321',
  },
];

type StudentContextValue = {
  students: Student[];
  addStudent: (input: StudentInput) => void;
  updateStudent: (id: string, input: StudentInput) => void;
  deleteStudent: (id: string) => void;
  getStudent: (id: string) => Student | undefined;
};

const StudentContext = createContext<StudentContextValue | undefined>(undefined);

export function StudentProvider({children}: {children: React.ReactNode}) {
  const [students, setStudents] = useState<Student[]>(SAMPLE_STUDENTS);

  const addStudent = (input: StudentInput) => {
    setStudents(prev => [...prev, {...input, id: Date.now().toString()}]);
  };

  const updateStudent = (id: string, input: StudentInput) => {
    setStudents(prev => prev.map(s => (s.id === id ? {...input, id} : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const getStudent = (id: string) => students.find(s => s.id === id);

  return (
    <StudentContext.Provider
      value={{students, addStudent, updateStudent, deleteStudent, getStudent}}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudents() {
  const ctx = useContext(StudentContext);
  if (!ctx) {
    throw new Error('useStudents must be used inside StudentProvider');
  }
  return ctx;
}
