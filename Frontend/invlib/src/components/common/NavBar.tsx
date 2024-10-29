'use client'
import * as React from 'react'
import Link from 'next/link'
import { Library, Menu, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useUser } from './GlobalContext'
import { logout } from '@/api/auth'
import { useRouter } from 'next/navigation'

const navItems = [
  { name: 'Home', href: '/home' },
  { name: 'Featured', href: '/featured' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const router = useRouter()
  const { user, setUser } = useUser();

  React.useEffect(() => {
  }, [user])
    
  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/home" className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary flex items-center">LocalLib<Library className='ml-1'/></span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {item.name}
                </Link>
              ))}
              {user && (
                  <Button className="text-foreground bg-white hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                  onClick={() => {
                      setUser(null);
                      logout();
                      router.push('/');
                    }
                }>
                {user ? 'Logout' : 'Login'}
              </Button>)}
            </div>
          </div>
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
                  <span className="sr-only">Open main menu</span>
                  {isOpen ? (
                    <X className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:max-w-none">
                <SheetTitle></SheetTitle>
                <SheetDescription></SheetDescription>
                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-gray-500/10">
                    <div className="space-y-2 py-6">
                      {navItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-accent"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                                    {user && (
                  <Button className="text-foreground bg-white hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                  onClick={() => {
                      setUser(null);
                      logout();
                      router.push('/');
                    }
                }>
                {user ? 'Logout' : 'Login'}
                  </Button>)}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}