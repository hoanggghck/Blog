import UserInfo from '@/features/user/UserData';
import { getUserInfo } from '@/hooks/user/useGetUserInfo';

export default async function  UserPage() {
  const userData = await getUserInfo();


  return (
    <div>

      <UserInfo user={userData} />
    </div>
  )
}
