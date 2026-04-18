import { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import Home from './pages/Home'
import PriceTheoryDiagrams from './pages/tools/PriceTheoryDiagrams'

const PdfViewer = lazy(() => import('./pages/PdfViewer'))

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tools/price-theory-diagrams" element={<PriceTheoryDiagrams />} />
      <Route path="/docs/:slug" element={<Suspense fallback={null}><PdfViewer /></Suspense>} />
    </Routes>
  </BrowserRouter>,
)
