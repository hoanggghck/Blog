"use client"
import Link from "next/link"
import { Menu, Search, User, PenSquare } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import logo from "@/assets/logo.png"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6 w-full mx-auto">

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                    <div className="bg-purple-600 flex items-center gap-2 p-4">
                        <Image
                            src={logo}
                            alt="BlogTechnology Logo"
                            width={36}
                            height={36}
                            className="rounded-md"
                        />
                        <h2 className="text-white font-bold text-lg">BlogTechnology</h2>
                    </div>
                    <nav className="flex flex-col p-4 gap-3">
                        <Link href="/" className="text-sm font-medium hover:text-purple-600">
                        Trang chủ
                        </Link>
                        <Link href="/categories" className="text-sm font-medium hover:text-purple-600">
                        Danh mục
                        </Link>
                        <Link href="/about" className="text-sm font-medium hover:text-purple-600">
                        Giới thiệu
                        </Link>
                        <Link href="/contact" className="text-sm font-medium hover:text-purple-600">
                        Liên hệ
                        </Link>

                        <div className="border-t my-3"></div>

                        <Button variant="outline" className="flex items-center gap-2">
                        <Search className="w-4 h-4" /> Tìm kiếm
                        </Button>
                        <Button className="bg-purple-600 text-white flex items-center gap-2">
                        <PenSquare className="w-4 h-4" /> Viết bài
                        </Button>
                    </nav>
                </SheetContent>
            </Sheet>
        </div>

        {/* Logo (desktop) */}
        <Link href="/" className="hidden md:flex items-center gap-2">
            <div className="bg-purple-600 p-1.5 rounded-full flex items-center justify-center">
                <Image
                    src={logo}
                    alt="BlogTechnology Logo"
                    width={28}
                    height={28}
                    className="rounded"
                />
            </div>
            <span className="text-xl font-bold text-gray-800">BlogTechnology</span>
        </Link>

        {/* Navigation (desktop only) */}
        <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-6">
                <NavigationMenuItem>
                    <Link href="/" className="text-sm font-medium hover:text-purple-600">
                        Trang chủ
                    </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <Link href="/categories" className="text-sm font-medium hover:text-purple-600">
                        Danh mục
                    </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <Link href="/about" className="text-sm font-medium hover:text-purple-600">
                        Giới thiệu
                    </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <Link href="/contact" className="text-sm font-medium hover:text-purple-600">
                        Liên hệ
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>

        {/* Actions */}
        <div className="flex items-center gap-4">
            {/* Search Icon */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
                <Search className="h-5 w-5" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                        <AvatarImage src="" alt="User" />
                        <AvatarFallback>
                        <User className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Xin chào!</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/login">Đăng nhập</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/register">Đăng ký</Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* CTA */}
            <Button className="hidden md:flex bg-purple-600 hover:bg-purple-700 text-white">
                Viết bài
            </Button>
        </div>
      </div>
    </header>
  )
}
