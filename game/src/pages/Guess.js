class Guess {
  constructor(answer, progress, sharedLetters, guess, isPlayerGuess) {
    this.answer = answer
    this.progress = progress
    this.sharedLetters = sharedLetters
    this.guess = guess
    this.isPlayerGuess = isPlayerGuess
  }

  handleGuess() {
    let alignedGuessResult = undefined
    if (this.isPlayerGuess) {
      alignedGuessResult = this.alignGuess()
      this.sharedLetters = this.compareGuess(
        alignedGuessResult.alignedGuess,
        alignedGuessResult.leftovers
      )
    }
    return {
      sharedLetters: this.sharedLetters,
      progress: this.progress,
      alignedGuess: alignedGuessResult.alignedGuess,
      leftovers: alignedGuessResult.leftovers,
    }
  }

  alignGuess() {
    const guessNoSpaces = this.guess.replace(/\s/g, '')
    const answerNoSpaces = this.answer.replace(/\s/g, '')

    let leftovers =
      guessNoSpaces.length > answerNoSpaces.length
        ? guessNoSpaces.substring(answerNoSpaces.length, guessNoSpaces.length)
        : ''

    let alignedGuessStr = ''
    let guessStrIndex = 0

    for (let char of this.answer) {
      if (char === ' ') {
        alignedGuessStr += ' '
      } else if (guessStrIndex < guessNoSpaces.length) {
        alignedGuessStr += guessNoSpaces[guessStrIndex]
        guessStrIndex += 1
      } else {
        alignedGuessStr += '!'
      }
    }
    return { alignedGuess: alignedGuessStr, leftovers: leftovers }
  }

  // can probably break into more helpers
  compareGuess(alignedGuess, leftovers, isTeam = false) {
    // get underscore representation of correct letters
    let answerParts = this.answer.split(' ')
    if (this.sharedLetters.length === 0) {
      this.sharedLetters = [...Array(answerParts.length)].map(() => [])
    }

    let underscoreBuild = this.getUnderscoreBuild(alignedGuess, leftovers)

    if (this.isPlayerGuess) {
      this.progress = this.updateProgress(underscoreBuild, isTeam)
    }

    // remove shared letter if already guessed all of that letter in the
    // respective answer part (could prob refactor to be in getUnderscoreBuild)
    let progressParts = this.progress
      .split(' ')
      .map((progressPart) => progressPart.split(''))

    answerParts = answerParts.map((answerPart) => answerPart.split(''))

    this.sharedLetters.map((sharedLetterPart, i) =>
      sharedLetterPart.map((char) => {
        let underscoreCharCount = progressParts[i].filter(
          (curr) => curr === char
        ).length
        let answerCharCount = answerParts[i].filter(
          (curr) => curr === char
        ).length
        if (underscoreCharCount >= answerCharCount) {
          this.sharedLetters[i] = sharedLetterPart.filter(
            (curr) => curr !== char
          )
        }
      })
    )

    this.sharedLetters = this.sharedLetters.map((sharedLetterPart) =>
      sharedLetterPart.sort()
    )
    return this.sharedLetters
  }

  getUnderscoreBuild(alignedGuess, leftovers) {
    let answerParts = this.answer.split(' ')
    let guessParts = alignedGuess.split(' ')
    let underscoreBuild = answerParts
      .map((answerPart, i) => {
        return answerPart
          .split('')
          .map((char, j) => {
            if (guessParts[i][j] === char) {
              return char
            } else {
              if (
                (alignedGuess.includes(char) || leftovers.includes(char)) &&
                !this.sharedLetters[i].includes(char)
              ) {
                this.sharedLetters[i].push(char)
              }
              return '_'
            }
          })
          .join('')
      })
      .join(' ')
    return underscoreBuild
  }

  updateProgress(newUnderscore, isTeam = false) {
    let existingUnderscore = ''

    if (this.isPlayerGuess) {
      existingUnderscore = this.progress
    }

    let updatedProgress = newUnderscore
      .split('')
      .map((char1, i) => {
        let char2 = existingUnderscore[i]
        if (char1 == ' ') {
          return ' '
        } else if (char1 != ' ' && char1 != '_') {
          return char1
        } else if (char2 != ' ' && char2 != '_') {
          return char2
        } else {
          return '_'
        }
      })
      .join('')

    return updatedProgress
  }
}

export default Guess
