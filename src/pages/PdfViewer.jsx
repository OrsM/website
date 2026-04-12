import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import * as pdfjsLib from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import BackBar from '../components/BackBar'
import { theme } from '../theme'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

const SCALE = 1.5

function PdfPage({ pdf, pageNum }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    async function render() {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale: SCALE })
      const canvas = canvasRef.current
      if (!canvas || cancelled) return
      canvas.width = viewport.width
      canvas.height = viewport.height
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
    }
    render()
    return () => { cancelled = true }
  }, [pdf, pageNum])

  return (
    <div style={{ marginBottom: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.12)' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />
    </div>
  )
}

export default function PdfViewer() {
  const { slug } = useParams()
  const [pdf, setPdf] = useState(null)
  const [numPages, setNumPages] = useState(0)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const doc = await pdfjsLib.getDocument(`/docs/${slug}.pdf`).promise
        setPdf(doc)
        setNumPages(doc.numPages)
      } catch {
        setError('Could not load PDF.')
      }
    }
    load()
  }, [slug])

  if (error) return (
    <div style={{ minHeight: '100vh' }}>
      <BackBar />
      <div style={{ padding: 40, color: theme.textMuted }}>{error}</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#e8e8e8' }}>
      <BackBar />
      {!pdf && (
        <div style={{ padding: 40, color: theme.textMuted, fontSize: 14 }}>Loading…</div>
      )}
      {pdf && (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px 64px' }}>
          {Array.from({ length: numPages }, (_, i) => (
            <PdfPage key={i + 1} pdf={pdf} pageNum={i + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
