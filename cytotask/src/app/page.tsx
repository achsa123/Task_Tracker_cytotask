import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect the root path to the dashboard. 
  // The middleware will automatically catch this and redirect to /auth/login if the user is not authenticated.
  redirect('/dashboard');
}
