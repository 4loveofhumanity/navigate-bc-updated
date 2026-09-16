import { Redirect } from 'expo-router';

// The Student ID is now the app's home route ('/').
export default function StudentIdRedirect() {
  return <Redirect href="/" />;
}
