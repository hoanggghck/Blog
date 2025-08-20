'use client'
import { UserType } from "@/types"
import { useState } from "react"

const UserInfo = (props: {user: UserType | undefined}) => {
  const { user } = props;
  const [userData, setUserData] = useState({
    name: 'Goddd'
  } as UserType);
  return (
    <>
      {user?.name}
      <p>Name: {userData?.name}</p>
      <p>Email: {userData?.email}</p>
    </>
  )
}

export default UserInfo;