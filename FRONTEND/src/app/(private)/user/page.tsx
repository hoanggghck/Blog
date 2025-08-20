'use client'
import { useGetUsers } from '@/hooks/user/useGetUser'
import React, { useEffect } from 'react'

export default function page() {
  const { data } = useGetUsers();
  useEffect(() => {
    console.log('aa');
    
  }, [])
  return (
    // <div>{data?.items.map(ele => {
    //   return ele.name
    // })}</div>
    <></>
  )
}
