import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import Home from './pages/Home'
import PmBookRecommender from './pages/tools/PmBookRecommender'
import PriceTheoryDiagrams from './pages/tools/PriceTheoryDiagrams'
import PriceTheoryFlashcards from './pages/tools/PriceTheoryFlashcards'

const PdfViewer = lazy(() => import('./pages/PdfViewer'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools/pm-book-recommender" element={<PmBookRecommender />} />
        <Route path="/tools/price-theory-diagrams" element={<PriceTheoryDiagrams />} />
        <Route path="/tools/price-theory-flashcards" element={<PriceTheoryFlashcards />} />
        <Route path="/docs/:slug" element={<Suspense fallback={null}><PdfViewer /></Suspense>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
