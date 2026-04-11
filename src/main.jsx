import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import Home from './pages/Home'
import PmBookRecommender from './pages/tools/PmBookRecommender'
import PriceTheoryDiagrams from './pages/tools/PriceTheoryDiagrams'
import PriceTheoryFlashcards from './pages/tools/PriceTheoryFlashcards'
import PriceTheoryQuiz from './pages/tools/PriceTheoryQuiz'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools/pm-book-recommender" element={<PmBookRecommender />} />
        <Route path="/tools/price-theory-diagrams" element={<PriceTheoryDiagrams />} />
        <Route path="/tools/price-theory-flashcards" element={<PriceTheoryFlashcards />} />
        <Route path="/tools/price-theory-quiz" element={<PriceTheoryQuiz />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
