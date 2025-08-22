"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, User } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6 w-full mx-auto">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-purple-600">
                BlogSpace
            </Link>

            {/* Navigation */}
            <NavigationMenu>
            <NavigationMenuList className="gap-6">
                <NavigationMenuItem>
                <Link href="/" className="text-sm font-medium hover:text-purple-600">
                    Home
                </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                <Link href="/categories" className="text-sm font-medium hover:text-purple-600">
                    Categories
                </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                <Link href="/about" className="text-sm font-medium hover:text-purple-600">
                    About
                </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                <Link href="/contact" className="text-sm font-medium hover:text-purple-600">
                    Contact
                </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-4">
            {/* Search Icon */}
            <Button variant="ghost" size="icon">
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
                <DropdownMenuLabel>Welcome to BlogSpace</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/login">Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/register">Register</Link>
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* CTA */}
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Write
            </Button>
            </div>
      </div>
    </header>
  )
}
