console.log('Importing from:', '../src/Guess.js')

import assert from 'assert'
import Guess from '../src/pages/Guess.js'

describe('handle guess - align guess', function () {
  it('should align long guess by saving leftover letters', function () {
    const guessObj = new Guess(
      'KATE DEL FAVA',
      '____ ___ ____',
      [],
      'MEGAN RAPINOE',
      true
    )
    assert.deepEqual(guessObj.alignGuess(), {
      alignedGuess: 'MEGA NRA PINO',
      leftovers: 'E',
    })
  })

  it('should align short guess with exclamations', function () {
    const guessObj = new Guess(
      'KATE DEL FAVA',
      '____ ___ ____',
      [],
      'MARTA',
      true
    )
    assert.deepEqual(guessObj.alignGuess(), {
      alignedGuess: 'MART A!! !!!!',
      leftovers: '',
    })
  })

  it('should handle non alpha chars', function () {
    const guessObj = new Guess(
      'KRISTIE MEWIS',
      '_______ _____',
      [],
      "KELLEY O'HARA",
      true
    )
    assert.deepEqual(guessObj.alignGuess(), {
      alignedGuess: "KELLEYO 'HARA",
      leftovers: '',
    })
  })
})

describe('handle guess - underscore build helper', function () {
  it('should format guess to underscore representation', function () {
    const guessObj = new Guess(
      'KATE DEL FAVA',
      '____ ___ ____',
      [],
      'KRISTIE MEWIS',
      true
    )
    guessObj.handleGuess()
    assert(guessObj.getUnderscoreBuild('KRIS TIE MEWI', 'S'), 'K___ ___ ____')
  })
})

describe('handle guess - shared letters', function () {
  it('should remove duplicated letters based on progress and guess', function () {
    const guessObj = new Guess(
      'HALEY KOPMEYER',
      'HAL_Y _OP_E___',
      [],
      'JANINE BECKIE',
      true
    )

    const result = guessObj.handleGuess()
    assert.deepEqual(result.sharedLetters, [['E'], ['K']])
  })
})
