export type Student = {
  id: string;
  name: string;
  rollNo: string;
  className: string;
  email: string;
  phone: string;
};

export type StudentInput = Omit<Student, 'id'>;

export type User = {
  username: string;
  name: string;
  role: 'admin' | 'teacher';
};
