export interface User {
  uid: string;
  email: string;
  displayName: string;
  userType: 'donor' | 'ngo' | 'volunteer';
  createdAt: Date;
}