export function generateSummary(text: string): string {
  // Static AI summary logic - extracting key sentences
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 20)

  if (sentences.length === 0) {
    return "Unable to generate summary from the provided text."
  }

  // Score sentences based on various factors
  const scoredSentences = sentences.map((sentence) => {
    let score = 0
    const words = sentence.toLowerCase().split(/\s+/)

    // Keywords that indicate importance
    const importantWords = [
      "important",
      "key",
      "main",
      "primary",
      "essential",
      "crucial",
      "significant",
      "major",
      "critical",
      "fundamental",
      "conclusion",
      "result",
      "finding",
      "discovery",
      "research",
      "study",
      "analysis",
    ]

    // Score based on important words
    words.forEach((word) => {
      if (importantWords.includes(word)) {
        score += 2
      }
    })

    // Prefer sentences with moderate length
    if (words.length >= 10 && words.length <= 25) {
      score += 1
    }

    // Boost sentences that appear early in the text
    const position = sentences.indexOf(sentence)
    if (position < sentences.length * 0.3) {
      score += 1
    }

    return { sentence: sentence.trim(), score }
  })

  // Sort by score and take top sentences
  const topSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(3, Math.ceil(sentences.length * 0.2)))
    .map((item) => item.sentence)

  // Reorder sentences to maintain original flow
  const summary = sentences.filter((sentence) => topSentences.includes(sentence.trim())).join(". ")

  return summary + (summary.endsWith(".") ? "" : ".")
}
