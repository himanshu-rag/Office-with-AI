import { redirect } from 'next/navigation';

export default function SignInPage() {
  // Force redirect to the office page immediately to bypass the broken Clerk auth
  redirect('/os/office');
  return null;
}
