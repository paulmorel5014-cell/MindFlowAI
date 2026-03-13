'use client'
import { useState } from 'react'

const FIELDS = [
  { key: 'otter-rdv',       label: 'Loutre RDV (costume bleu + téléphone agenda)' },
  { key: 'otter-radar',     label: 'Loutre Radar (trench + loupe)' },
  { key: 'otter-analytics', label: 'Loutre Analytics (blouse blanche + clipboard)' },
]

export default function UploadOtters() {
  const [files, setFiles] = useState<Record<string, File>>({})
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleFile(key: string, f: File | null) {
    if (!f) return
    setFiles(prev => ({ ...prev, [key]: f }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData()
    for (const { key } of FIELDS) {
      if (files[key]) form.append(key, files[key])
    }
    try {
      const res = await fetch('/api/upload-otters', { method: 'POST', body: form })
      const data = await res.json()
      if (data.success) {
        setResult(`✅ Fichiers sauvegardés : ${data.saved.join(', ')}`)
      } else {
        setResult('❌ Erreur lors de l\'upload')
      }
    } catch {
      setResult('❌ Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 540, margin: '60px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Upload des mascottes OtterFlow</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Sélectionne chaque image puis clique sur Envoyer.
      </p>
      <form onSubmit={handleSubmit}>
        {FIELDS.map(({ key, label }) => (
          <div key={key} style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>{label}</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => handleFile(key, e.target.files?.[0] ?? null)}
              style={{ display: 'block' }}
            />
            {files[key] && (
              <span style={{ fontSize: 13, color: '#16a34a' }}>✓ {files[key].name}</span>
            )}
          </div>
        ))}
        <button
          type="submit"
          disabled={loading || Object.keys(files).length === 0}
          style={{
            marginTop: 12,
            padding: '10px 28px',
            background: '#7c3aed',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 15,
            cursor: loading ? 'wait' : 'pointer',
            opacity: Object.keys(files).length === 0 ? 0.5 : 1,
          }}
        >
          {loading ? 'Envoi...' : 'Envoyer'}
        </button>
      </form>
      {result && (
        <p style={{ marginTop: 24, fontSize: 15, padding: '12px 16px', background: '#f0fdf4', borderRadius: 8 }}>
          {result}
        </p>
      )}
    </div>
  )
}
