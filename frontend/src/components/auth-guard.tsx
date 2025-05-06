'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';

interface AuthGuardProps {
  children: ReactNode;
  allowedUserTypes?: ('STUDENT' | 'TEACHER')[];
}

export function AuthGuard({ 
  children, 
  allowedUserTypes 
}: AuthGuardProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.replace("/");
      return;
    }

    // Redirect to correct dashboard if user is not allowed
    if (allowedUserTypes && user && !allowedUserTypes.includes(user.role)) {
      const fallbackUrl = user.role === 'STUDENT' 
        ? '/student/dashboard' 
        : '/teacher/dashboard';
      router.replace(fallbackUrl);
      return;
    }

    // Passed all checks
    setIsAuthorized(true);
  }, [isAuthenticated, isLoading, user, allowedUserTypes, pathname, router]);

  // While loading or checking access
  // if (isLoading || !isAuthorized) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <div className="text-center text-muted-foreground text-sm">
  //         Loading...
  //       </div>
  //     </div>
  //   );
  // }

  // Authorized user view
  return <>{children}</>;
}
