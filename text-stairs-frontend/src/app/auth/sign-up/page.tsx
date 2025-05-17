'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/context/auth-context'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC, FormEvent, useState } from 'react'

const SignUpPage: FC = () => {
	const { signUp } = useAuth()
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [fullName, setFullName] = useState('')
	const [rememberMe, setRememberMe] = useState(false)
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const validatePassword = (password: string) => {
		if (password.length < 6) {
			return 'Пароль повинен містити мінімум 6 символів'
		}
		if (!/[A-Z]/.test(password)) {
			return 'Пароль повинен містити хоча б одну велику літеру'
		}
		if (!/[a-z]/.test(password)) {
			return 'Пароль повинен містити хоча б одну малу літеру'
		}
		if (!/[0-9]/.test(password)) {
			return 'Пароль повинен містити хоча б одну цифру'
		}
		return null
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError('')
		setIsLoading(true)

		const passwordError = validatePassword(password)
		if (passwordError) {
			setError(passwordError)
			setIsLoading(false)
			return
		}

		try {
			await signUp(email, password, fullName, rememberMe)
			router.push('/profile')
		} catch (error) {
			setError(
				error instanceof Error ? error.message : 'Помилка при реєстрації'
			)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='container mx-auto py-8'>
			<Card className='max-w-md mx-auto'>
				<CardHeader>
					<CardTitle>Реєстрація</CardTitle>
					<CardDescription>Створіть новий обліковий запис</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className='space-y-4'>
						{error && (
							<div className='p-3 text-sm text-red-500 bg-red-50 rounded-md'>
								{error}
							</div>
						)}
						<div className='space-y-2'>
							<Label htmlFor='fullName'>Повне ім&apos;я</Label>
							<Input
								id='fullName'
								type='text'
								placeholder="Введіть ваше повне ім'я"
								value={fullName}
								onChange={e => setFullName(e.target.value)}
								required
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								placeholder='Введіть ваш email'
								value={email}
								onChange={e => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='password'>Пароль</Label>
							<Input
								id='password'
								type='password'
								placeholder='Введіть ваш пароль'
								value={password}
								onChange={e => setPassword(e.target.value)}
								required
							/>
						</div>
						<div className='flex items-center space-x-2'>
							<Checkbox
								id='remember'
								checked={rememberMe}
								onCheckedChange={checked => setRememberMe(checked as boolean)}
							/>
							<Label
								htmlFor='remember'
								className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
							>
								Запам&apos;ятати мене
							</Label>
						</div>
						<Button
							type='submit'
							className='w-full bg-emerald-600 hover:bg-emerald-700'
							disabled={isLoading}
						>
							{isLoading ? 'Реєстрація...' : 'Зареєструватися'}
						</Button>
						<div className='text-center text-sm'>
							Вже маєте обліковий запис?{' '}
							<Link
								href='/auth/sign-in'
								className='text-emerald-600 hover:text-emerald-700'
							>
								Увійти
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

export default SignUpPage
