"use client";
import Image from "next/image";
import Link from "next/link";
import { Search, User } from "lucide-react";
import { useRouter } from "next/navigation";
// Dev
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.png";
import { useUserStore } from "@/stores/useUserStore";
import { useLogout } from "@/hooks/auth/useAuth";

export default function DesktopPart({navItems = []}: {navItems: Record<string, string>[]}) {
  const { user } = useUserStore();
  const logoutMution = useLogout();
  const logoutHandle = () => {
    logoutMution.mutate();
  }
  const router = useRouter()
  
  return (
    <>
    <Link href="/" className="flex items-center gap-2">
      <div className="bg-purple-600 p-1.5 rounded-full flex items-center justify-center">
        <Image
          src={logo}
          alt="BlogTechnology Logo"
          width={28}
          height={28}
          className="rounded"
        />
      </div>
      <span className="text-xl font-bold text-gray-800">
        BlogTechnology
      </span>
    </Link>
    <NavigationMenu className="flex">
      <NavigationMenuList className="gap-6">
        {navItems.map((ele, index) => {
          return (
            <NavigationMenuItem key={index}>
              <Link
                href={ele.href}
                className="text-sm font-medium hover:text-purple-600"
              >
                {ele.label}
              </Link>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" className="hidden md:flex">
        <Search className="h-5 w-5" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {user.id ? (
            <>
              <DropdownMenuLabel>Xin chào {user.name}!</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link className="cursor-pointer" href="/login">
                  Thông tin cá nhân
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a className="cursor-pointer" onClick={logoutHandle}>
                  Đăng xuất
                </a>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem asChild>
                <Link href="/login">Đăng nhập</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/register">Đăng ký</Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {user.id && (
        <Button className="hidden md:flex bg-purple-600 hover:bg-purple-700 text-white cursor-pointer" onClick={() => router.push("/blog/create")}>
            Viết bài
        </Button>
      )}
    </div>
    </>
  )
}
