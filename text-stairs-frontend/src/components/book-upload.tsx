'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/lib/context/auth-context'
import { FileUp, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type AnalysisType =
	| 'analyze'
	| 'short-summary'
	| 'characters-quotes'
	| 'text-quotes'

const analysisTypes = [
	{
		value: 'analyze',
		label: 'Повний аналіз',
		description: 'Детальний аналіз книги з усіма аспектами',
	},
	{
		value: 'short-summary',
		label: 'Короткий переказ',
		description: 'Стислий переказ основних подій та ідей',
	},
	{
		value: 'characters-quotes',
		label: 'Персонажі та цитати',
		description: 'Аналіз персонажів та їх ключових цитат',
	},
	{
		value: 'text-quotes',
		label: 'Текстові цитати',
		description: 'Аналіз ключових цитат з тексту',
	},
]

export function BookUpload() {
	const { user } = useAuth()
	const router = useRouter()
	const [file, setFile] = useState<File | null>(null)
	const [analysisType, setAnalysisType] = useState<AnalysisType>('analyze')
	const [isUploading, setIsUploading] = useState(false)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0])
		}
	}

	const handleUpload = () => {
		if (!file || !analysisType) return

		setIsUploading(true)

		// Save file and analysis type to localStorage
		const fileReader = new FileReader()
		fileReader.onload = () => {
			localStorage.setItem('pending_analysis_file', fileReader.result as string)
			localStorage.setItem('pending_analysis_type', analysisType)
			localStorage.setItem('pending_analysis_filename', file.name)

			// Redirect to sign-in if not authenticated, otherwise to chat
			if (!user) {
				router.push('/auth/sign-in')
			} else {
				router.push('/chat')
			}
		}
		fileReader.readAsDataURL(file)
	}

	return (
		<div className='space-y-4'>
			<div className='space-y-2'>
				<Label htmlFor='file'>Завантажте книгу (PDF)</Label>
				<div className='flex items-center gap-2'>
					<Input
						id='file'
						type='file'
						accept='.pdf'
						onChange={handleFileChange}
						className='file:text-emerald-600 file:hover:bg-emerald-100'
					/>
				</div>
				{file && (
					<p className='text-sm text-emerald-600'>Обрано: {file.name}</p>
				)}
			</div>

			<div className='space-y-2'>
				<Label htmlFor='analysis-type'>Тип аналізу</Label>
				<Select
					value={analysisType}
					onValueChange={(value: AnalysisType) => setAnalysisType(value)}
				>
					<SelectTrigger id='analysis-type'>
						<SelectValue placeholder='Оберіть тип аналізу' />
					</SelectTrigger>
					<SelectContent>
						{analysisTypes.map(type => (
							<SelectItem key={type.value} value={type.value}>
								<div className='flex flex-col'>
									<span>{type.label}</span>
									<span className='text-xs text-gray-500'>
										{type.description}
									</span>
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<Button
				onClick={handleUpload}
				disabled={!file || !analysisType || isUploading}
				className='w-full bg-emerald-600 hover:bg-emerald-700'
			>
				{isUploading ? (
					<>
						<Loader2 className='mr-2 h-4 w-4 animate-spin' />
						Обробка...
					</>
				) : (
					<>
						<FileUp className='mr-2 h-4 w-4' />
						Аналізувати
					</>
				)}
			</Button>
		</div>
	)
}
