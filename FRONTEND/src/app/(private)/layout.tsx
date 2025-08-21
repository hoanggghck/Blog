import React from 'react';

import UserHydrator from './UserHydrator';
import { getUserInfo } from '@/hooks/user/useGetUserInfo';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserInfo();

  return (
    <>
      <UserHydrator user={user} />
      {children}
    </>
  );
}
