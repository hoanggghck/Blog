import React from 'react';

import UserHydrator from './UserHydrator';
import { getUserInfoFromServer } from '@/hooks/user/useGetUserInfo';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserInfoFromServer();

  return (
    <>
      <UserHydrator user={user} />
      {children}
    </>
  );
}