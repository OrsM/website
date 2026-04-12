import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function PdfViewer() {
  const { slug } = useParams()

  useEffect(() => {
    window.location.replace(`/pdfjs/web/viewer.html?file=/docs/${slug}.pdf`)
  }, [slug])

  return null
}
