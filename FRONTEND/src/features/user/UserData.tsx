'use client'
import { useGetUsers } from "@/hooks/user/useGetUser";
import { UserType } from "@/types"
import { useState } from "react"

const UserInfo = (props: {user: UserType | undefined}) => {
  const { user } = props;
  const { data } = useGetUsers();

  const [userData, setUserData] = useState({
    name: 'Goddd'
  } as UserType);
  return (
    <>
      {user?.name}
      {
        data?.items.map(ele => {
          return ele.email
        })
      }
      <p>Name: {userData?.name}</p>
      <p>Email: {userData?.email}</p>
    </>
  )
}

export default UserInfo;
