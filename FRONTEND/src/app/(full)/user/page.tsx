import { Button } from '@/components/ui/button'
import UserInfo from '@/features/user/UserData'
import Link from 'next/link'

export default async function UserPage() {

  return (
    <div>
      <Button>
        <Link href='/'>Home</Link>
      </Button>
      <UserInfo />
    </div>
  )
}
