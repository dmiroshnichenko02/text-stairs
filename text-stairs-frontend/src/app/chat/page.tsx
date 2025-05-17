'use client'

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
import { useEffect, useState } from 'react'

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

export default function ChatPage() {
	const { user } = useAuth()
	const router = useRouter()
	const [file, setFile] = useState<File | null>(null)
	const [analysisType, setAnalysisType] = useState<AnalysisType>('analyze')
	const [isUploading, setIsUploading] = useState(false)
	const [result, setResult] = useState<{
		pageCount: number
		tokenUsage: {
			prompt_tokens: number
			completion_tokens: number
			total_tokens: number
		}
		chunkAnalyses: string[]
		finalAnalysis: string
	} | null>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!user) {
			router.push('/auth/sign-in')
			return
		}

		// Check for saved file and analysis type
		const savedFile = localStorage.getItem('pending_analysis_file')
		const savedAnalysisType = localStorage.getItem(
			'pending_analysis_type'
		) as AnalysisType
		const savedFilename = localStorage.getItem('pending_analysis_filename')

		if (savedFile && savedAnalysisType && savedFilename) {
			// Convert base64 to File
			fetch(savedFile)
				.then(res => res.blob())
				.then(blob => {
					const file = new File([blob], savedFilename, {
						type: 'application/pdf',
					})
					setFile(file)
					setAnalysisType(savedAnalysisType)

					// Clear localStorage
					localStorage.removeItem('pending_analysis_file')
					localStorage.removeItem('pending_analysis_type')
					localStorage.removeItem('pending_analysis_filename')
				})
		}
	}, [user, router])

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0])
		}
	}

	const handleSubmit = async () => {
		if (!file || !analysisType) return

		setIsUploading(true)
		setError(null)

		const formData = new FormData()
		formData.append('file', file)
		formData.append('analysisType', analysisType)

		try {
			const response = await fetch('http://localhost:3001/books/analyze', {
				method: 'POST',
				body: formData,
				credentials: 'include',
			})

			if (!response.ok) {
				throw new Error('Помилка при аналізі книги')
			}

			const data = await response.json()
			setResult(data)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Помилка при аналізі книги')
		} finally {
			setIsUploading(false)
		}
	}

	return (
		<div className='container mx-auto p-4 space-y-8'>
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
					onClick={handleSubmit}
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

				{error && (
					<div className='p-4 bg-red-50 text-red-600 rounded-lg'>{error}</div>
				)}
			</div>

			{result && (
				<div className='space-y-6'>
					<div className='grid grid-cols-2 gap-4'>
						<div className='p-4 bg-gray-50 rounded-lg'>
							<p className='text-sm text-gray-500'>Кількість сторінок</p>
							<p className='text-lg font-semibold'>{result.pageCount}</p>
						</div>
						<div className='p-4 bg-gray-50 rounded-lg'>
							<p className='text-sm text-gray-500'>Використано токенів</p>
							<p className='text-lg font-semibold'>
								{result.tokenUsage.total_tokens}
							</p>
						</div>
					</div>

					{result.chunkAnalyses && result.chunkAnalyses.length > 0 && (
						<div className='space-y-4'>
							<h3 className='text-lg font-semibold'>Аналіз частин</h3>
							{result.chunkAnalyses.map((analysis, index) => (
								<div key={index} className='p-4 bg-gray-50 rounded-lg'>
									<p className='text-sm text-gray-500'>Частина {index + 1}</p>
									<p className='whitespace-pre-wrap'>{analysis}</p>
								</div>
							))}
						</div>
					)}

					{result.finalAnalysis && (
						<div className='space-y-4'>
							<h3 className='text-lg font-semibold'>Фінальний аналіз</h3>
							<div className='p-4 bg-gray-50 rounded-lg'>
								<p className='whitespace-pre-wrap'>{result.finalAnalysis}</p>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
