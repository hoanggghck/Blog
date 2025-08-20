import UserInfo from '@/features/user/UserData';
import { getUserInfoFromServer } from '@/hooks/user/useGetUserInfo';
import { useUserStore } from '@/stores/useUserStore';
import { UserType } from '@/types';

export default async function  UserPage() {
  const userData = await getUserInfoFromServer();

  return (
    <div>
      <UserInfo user={userData} />
    </div>
  )
}
