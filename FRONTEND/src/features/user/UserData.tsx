'use client'
import { userApi } from "@/apis";
import { UserType } from "@/types"
import { ApiResponseListType } from "@/types/common";
import Link from "next/link";
import { useEffect, useState } from "react"

const UserInfo = () => {
  const [users, setUsers] = useState<ApiResponseListType<UserType>>();
  const fetchUsers = async () => {
    await userApi.getList();
    // if (data) {
    //   setUsers(data.result);
    // } else {
    // }
  };
  useEffect(() => {
    fetchUsers()
  }, []);
  return (
    <>
      <p>DS</p>
      {/* {
        users?.items.map(ele => {
          return <p key={ele.id}>{ele.email}</p>
        })
      } */}
      <Link href="/">Home</Link>
    </>
  )
}

export default UserInfo;
