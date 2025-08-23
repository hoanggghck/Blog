'use client'
import { userApi } from "@/apis";
import { Button } from "@/components/ui/button";
import { useGetUsers } from "@/hooks/user/useGetUser";
import { getUserInfo } from "@/hooks/user/useGetUserInfo";
import { UserType } from "@/types"
import { ApiResponseListType } from "@/types/common";
import Link from "next/link";
import { useEffect, useState } from "react"

const UserInfo = (props: {user: UserType | undefined}) => {
  const { user } = props;
  // const { data } = useGetUsers();
  const [users, setUsers] = useState<ApiResponseListType<UserType>>();
const getUserData = async () => {
    const user = await getUserInfo();
    setUserData(user)
  }
  const [userData, setUserData] = useState(user as UserType);
  const fetchUsers = async () => {
    const { data } = await userApi.getList();
    setUsers(data.result);
  };
  useEffect(() => {
    fetchUsers()
  }, []);
  return (
    <>
      {user?.name}
      <p>DS</p>
      {
        users?.items.map(ele => {
          return <p key={ele.id}>{ele.email}</p>
        })
      }
      <p>Name: {userData?.name}</p>
      <p>Email: {userData?.email}</p>
      <Link href="/">Home</Link>
      <Button onClick={getUserData}>
        Get user
      </Button>
    </>
  )
}

export default UserInfo;
