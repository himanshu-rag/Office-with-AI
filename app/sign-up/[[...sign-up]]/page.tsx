import { redirect } from 'next/navigation';

export default function SignUpPage() {
  // Bypass Clerk auth completely because it's failing on the local network
  redirect('/os/office');
  return null;
}
