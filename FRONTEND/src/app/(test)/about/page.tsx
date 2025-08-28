import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function About() {
  return (
    <div>
      <Button>
        <Link href="/user">User</Link>
      </Button>
      <Button>
        <Link href="/about">About</Link>
      </Button>
    </div>
  )
}
