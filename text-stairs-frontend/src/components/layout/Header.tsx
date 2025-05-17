'use client'

import { useAuth } from '@/lib/context/auth-context'
import { BookOpen, LogOut, MessageSquare, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { Button } from '../ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu'

const Header: FC = () => {
	const { user, signOut } = useAuth()
	const router = useRouter()

	const handleSignOut = async () => {
		try {
			await signOut()
			router.push('/')
		} catch (error) {
			console.error('Sign out error:', error)
		}
	}

	return (
		<header className='border-b'>
			<div className='container flex items-center justify-between py-4 mx-auto'>
				<Link href={'/'} className='flex items-center gap-2'>
					<BookOpen className='w-6 h-6 text-emerald-600' />
					<span className='text-xl font-bold'>TextStairs</span>
				</Link>
				<nav className='hidden md:flex items-center gap-6'>
					<Link
						href='/#features'
						className='text-sm font-medium hover:underline'
					>
						Можливості
					</Link>
					<Link
						href='/#pricing'
						className='text-sm font-medium hover:underline'
					>
						Тарифи
					</Link>
					<Link href='/#demo' className='text-sm font-medium hover:underline'>
						Демо
					</Link>
					{user && (
						<Link
							href='/chat'
							className='text-sm font-medium hover:underline flex items-center gap-1'
						>
							<MessageSquare className='w-4 h-4' />
							Чат
						</Link>
					)}
				</nav>
				<div className='flex items-center gap-2'>
					{user ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant='outline' size='sm'>
									<User className='w-4 h-4 mr-2' />
									{user.full_name || user.email}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end'>
								<DropdownMenuItem asChild>
									<Link href='/profile' className='flex items-center'>
										<User className='w-4 h-4 mr-2' />
										Профіль
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={handleSignOut}>
									<LogOut className='w-4 h-4 mr-2' />
									Вийти
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<>
							<Button variant='outline' size='sm'>
								<Link href={'/auth/sign-in'}>Увійти</Link>
							</Button>
							<Button size='sm' className='bg-emerald-600 hover:bg-emerald-700'>
								<Link href={'/auth/sign-up'}>Реєстрація</Link>
							</Button>
						</>
					)}
				</div>
			</div>
		</header>
	)
}

export default Header
