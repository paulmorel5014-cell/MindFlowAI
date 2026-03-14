import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

const ALLOWED = ['otter-rdv', 'otter-radar', 'otter-analytics']

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const saved: string[] = []
  for (const name of ALLOWED) {
    const file = form.get(name) as File | null
    if (!file) continue
    const bytes = await file.arrayBuffer()
    const dest = path.join(process.cwd(), 'public', 'images', `${name}.png`)
    await writeFile(dest, Buffer.from(bytes))
    saved.push(`${name}.png`)
  }
  return NextResponse.json({ success: true, saved })
}
