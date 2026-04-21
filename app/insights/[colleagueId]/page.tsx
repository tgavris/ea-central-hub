import { redirect } from 'next/navigation'
import { colleagues } from '@/lib/data/colleagues'

export function generateStaticParams() {
  return colleagues.map((c) => ({ colleagueId: c.id }))
}

interface ColleagueInsightsPageProps {
  params: Promise<{ colleagueId: string }>
}

export default async function ColleagueInsightsPage({ params }: ColleagueInsightsPageProps) {
  const { colleagueId } = await params
  redirect(`/todo/${colleagueId}`)
}
