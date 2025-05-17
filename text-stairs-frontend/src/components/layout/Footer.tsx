import { BookOpen } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'

const Footer: FC = () => {
	return (
		<footer className='border-t bg-gray-50'>
			<div className='container flex flex-col mx-auto gap-4 py-10 md:flex-row md:gap-8 md:py-12'>
				<div className='flex-1 space-y-4'>
					<div className='flex items-center gap-2'>
						<BookOpen className='w-6 h-6 text-emerald-600' />
						<span className='text-xl font-bold'>TextStairs</span>
					</div>
					<p className='text-sm text-gray-500'>
						Розкрийте потенціал книг з TextStairs. Аналізуйте, вивчайте,
						розвивайтесь.
					</p>
				</div>
				<div className='flex flex-col gap-2 md:gap-4'>
					<h3 className='text-sm font-medium'>Компанія</h3>
					<nav className='flex flex-col gap-2 text-sm text-gray-500'>
						<Link href='#' className='hover:underline'>
							Про нас
						</Link>
						<Link href='#' className='hover:underline'>
							Контакти
						</Link>
						<Link href='#' className='hover:underline'>
							Блог
						</Link>
					</nav>
				</div>
				<div className='flex flex-col gap-2 md:gap-4'>
					<h3 className='text-sm font-medium'>Правова інформація</h3>
					<nav className='flex flex-col gap-2 text-sm text-gray-500'>
						<Link href='#' className='hover:underline'>
							Умови використання
						</Link>
						<Link href='#' className='hover:underline'>
							Політика конфіденційності
						</Link>
						<Link href='#' className='hover:underline'>
							Cookies
						</Link>
					</nav>
				</div>
			</div>
			<div className='border-t'>
				<div className='container mx-auto flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between md:py-8'>
					<p className='text-sm text-gray-500'>
						© 2025 TextStairs. Всі права захищені.
					</p>
					<div className='flex gap-4'>
						<Link href='#' className='text-gray-500 hover:text-gray-900'>
							<span className='sr-only'>Twitter</span>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
								className='h-5 w-5'
							>
								<path d='M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z'></path>
							</svg>
						</Link>
						<Link href='#' className='text-gray-500 hover:text-gray-900'>
							<span className='sr-only'>Instagram</span>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
								className='h-5 w-5'
							>
								<rect width='20' height='20' x='2' y='2' rx='5' ry='5'></rect>
								<path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z'></path>
								<line x1='17.5' x2='17.51' y1='6.5' y2='6.5'></line>
							</svg>
						</Link>
						<Link href='#' className='text-gray-500 hover:text-gray-900'>
							<span className='sr-only'>Facebook</span>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
								className='h-5 w-5'
							>
								<path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'></path>
							</svg>
						</Link>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
