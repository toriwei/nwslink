class Guess {
  constructor(answer, progress, sharedLetters, guess, isPlayerGuess) {
    this.answer = answer
    this.progress = progress
    this.sharedLetters = sharedLetters
    this.guess = guess
    this.isPlayerGuess = isPlayerGuess
  }

  handleGuess() {
    const alignAndCompare = (guess, answer, isTeam = false) => {
      const result = this.alignGuess(guess, answer)
      return {
        sharedLetters: this.compareGuess(
          result.alignedGuess,
          result.leftovers,
          answer,
          isTeam
        ),
        progress: this.progress,
        alignedGuess: result.alignedGuess,
        leftovers: result.leftovers,
      }
    }

    if (this.isPlayerGuess) {
      return alignAndCompare(this.guess, this.answer)
    }

    const answerParts = this.answer.split(' ')
    const guessParts = this.guess.split(' ')

    const [answerTeam, answerSeason] = [
      answerParts.slice(0, -1).join(' '),
      answerParts.slice(-1)[0],
    ]
    const [guessTeam, guessSeason] = [
      guessParts.slice(0, -1).join(' '),
      guessParts.slice(-1)[0],
    ]

    const resultTeam = alignAndCompare(guessTeam, answerTeam, true)
    const resultSeason = alignAndCompare(guessSeason, answerSeason)

    const alignedGuess = `${resultTeam.alignedGuess} ${resultSeason.alignedGuess}`

    const leftovers = resultTeam.leftovers

    return {
      sharedLetters: this.sharedLetters,
      progress: this.progress,
      alignedGuess: alignedGuess,
      leftovers: leftovers,
    }
  }

  alignGuess(guess, answer) {
    const guessNoSpaces = guess.replace(/\s/g, '')
    const answerNoSpaces = answer.replace(/\s/g, '')

    let leftovers =
      guessNoSpaces.length > answerNoSpaces.length
        ? guessNoSpaces.substring(answerNoSpaces.length, guessNoSpaces.length)
        : ''

    let alignedGuessStr = ''
    let guessStrIndex = 0

    for (let char of answer) {
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
  compareGuess(alignedGuess, leftovers, answer, isTeam = false) {
    // get underscore representation of correct letters
    let answerParts = this.answer.split(' ')
    if (this.sharedLetters.length === 0) {
      this.sharedLetters = [...Array(answerParts.length)].map(() => [])
    }

    let underscoreBuild = this.getUnderscoreBuild(
      alignedGuess,
      leftovers,
      answer,
      isTeam
    )

    if (this.isPlayerGuess) {
      this.progress = this.updateProgress(underscoreBuild)
    } else {
      let splitProgress = this.progress.split(' ')
      if (isTeam) {
        let teamProgress = this.updateProgress(
          underscoreBuild,
          (isTeam = true)
        ).split(' ')
        teamProgress.map((progressPart, i) => (splitProgress[i] = progressPart))
      } else {
        splitProgress[splitProgress.length - 1] =
          this.updateProgress(underscoreBuild)
      }
      this.progress = splitProgress.join(' ')
    }

    // remove shared letter if already guessed all of that letter in the
    // respective answer part (could prob refactor to be in getUnderscoreBuild)
    let progressParts = this.progress
      .split(' ')
      .map((progressPart) => progressPart.split(''))

    answerParts = answerParts.map((answerPart) => answerPart.split(''))

    this.sharedLetters = this.sharedLetters.map((sharedLetterPart, i) => {
      return sharedLetterPart
        .map((char) => {
          let underscoreCharCount = progressParts[i].filter(
            (curr) => curr === char
          ).length
          let answerCharCount = answerParts[i].filter(
            (curr) => curr === char
          ).length
          if (underscoreCharCount < answerCharCount) {
            return char
          }
          return null
        })
        .filter((char) => char !== null)
    })

    this.sharedLetters = this.sharedLetters.map((sharedLetterPart) =>
      sharedLetterPart.sort()
    )
    return this.sharedLetters
  }

  getUnderscoreBuild(alignedGuess, leftovers, answer, isTeam = false) {
    let answerParts = answer.split(' ').map((part) => part.split(''))
    let guessParts = alignedGuess.split(' ')

    let sharedLettersArray =
      this.isPlayerGuess || isTeam
        ? this.sharedLetters
        : this.sharedLetters.slice(-1)

    let underscoreBuild = answerParts
      .map((answerPart, i) => {
        return answerPart
          .map((char, j) => {
            if (guessParts[i][j] === char) {
              return char
            } else if (
              (alignedGuess.includes(char) || leftovers.includes(char)) &&
              !sharedLettersArray[i].includes(char)
            ) {
              sharedLettersArray[i].push(char)
            }
            return '_'
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
    } else {
      let splitProgress = this.progress.split(' ')
      existingUnderscore = isTeam
        ? splitProgress.slice(0, -1).join(' ')
        : splitProgress.slice(-1)[0]
    }

    let updatedProgress = newUnderscore
      .split('')
      .map((char1, i) => {
        let char2 = existingUnderscore[i]
        return char1 !== '_' ? char1 : char2 !== '_' ? char2 : '_'
      })
      .join('')

    return updatedProgress
  }
}

export default Guess
