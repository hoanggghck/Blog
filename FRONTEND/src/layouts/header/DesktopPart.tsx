"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import _ from "lodash";

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
import { useAuthenStore } from "@/stores/useAuthenStore";
import { useLogout } from "@/hooks/auth/useAuth";
import { useDialog } from "@/provider/dialogLoginProvider";
import { getSeason } from "@/lib/season";
import { ROLES } from "@/const/enum";

export default function DesktopPart({navItems = []}: {navItems: Record<string, string>[]}) {
  const { user } = useAuthenStore();
  const { textColor } = getSeason();
  const logoutMution = useLogout();
  const logoutHandle = () => {
    logoutMution.mutate();
  }
  const router = useRouter();
  const { openDialog } = useDialog();
  const isAdmin = user.role?.id === ROLES.ADMIN
  
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
        <span className={`text-xl font-bold ${textColor}`}>
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
                  className={`text-sm font-medium hover:text-purple-600 ${textColor}`}
                >
                  {ele.label}
                </Link>
              </NavigationMenuItem>
            )
          })}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{_.first(user.name)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {user.id ? (
              <>
                <DropdownMenuLabel>Xin chào {user.name}!</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && <DropdownMenuItem asChild>
                  <Link className="cursor-pointer" href="/dashboard">
                    Bảng điều khiển
                  </Link>
                </DropdownMenuItem>
                }
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
        <Button 
          className="hidden md:flex bg-purple-600 hover:bg-purple-700 text-white cursor-pointer" 
          onClick={() => openDialog(() => router.push("/blog/create"))}
        >
          Viết bài
        </Button>
      </div>
    </>
  )
}
