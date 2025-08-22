"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-10 w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 px-6 py-12 w-full">
        
        {/* Brand */}
        <div>
          <h2 className="font-bold text-lg text-purple-600">BlogSpace</h2>
          <p className="text-sm mt-2 text-gray-600">
            Discover amazing stories, insights, and ideas from writers around the world.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><a href="/">Home</a></li>
            <li><a href="/categories">Categories</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h2 className="font-semibold mb-3">Categories</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>Technology</li>
            <li>Design</li>
            <li>Business</li>
            <li>Lifestyle</li>
          </ul>
        </div>

        {/* Subscribe */}
        <div>
          <h2 className="font-semibold mb-3">Stay Updated</h2>
          <div className="flex flex-col gap-2">
            <Input type="email" placeholder="Enter your email" />
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">Subscribe</Button>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="text-center text-gray-500 text-sm pb-6 w-full">
        © 2025 BlogSpace. All rights reserved.
      </div>
    </footer>
  )
}
