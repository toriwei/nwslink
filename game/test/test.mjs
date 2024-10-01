import assert from 'assert'
import Guess from '../src/pages/Guess.js'
describe('helper functions in handleGuess - players', function () {
  describe('align guess', function () {
    it('should save leftover letters for long guesses', function () {
      const guessObj = new Guess(
        'KATE DEL FAVA',
        '____ ___ ____',
        [],
        'MEGAN RAPINOE',
        true
      )
      assert.deepEqual(guessObj.alignGuess('MEGAN RAPINOE', 'KATE DEL FAVA'), {
        alignedGuess: 'MEGA NRA PINO',
        leftovers: 'E',
      })
    })

    it('should add exclamation points for short guesses', function () {
      const guessObj = new Guess(
        'KATE DEL FAVA',
        '____ ___ ____',
        [],
        'MARTA',
        true
      )
      assert.deepEqual(guessObj.alignGuess('MARTA', 'KATE DEL FAVA'), {
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
      assert.deepEqual(guessObj.alignGuess("KELLEY O'HARA", 'KRISTIE MEWIS'), {
        alignedGuess: "KELLEYO 'HARA",
        leftovers: '',
      })
    })
  })

  describe('underscoreBuild', function () {
    it('should format guess to underscore representation', function () {
      const guessObj = new Guess(
        'KATE DEL FAVA',
        '____ ___ ____',
        [],
        'KRISTIE MEWIS',
        true
      )
      guessObj.handleGuess()
      assert.equal(
        guessObj.getUnderscoreBuild('KRIS TIE MEWI', 'S', 'KATE DEL FAVA'),
        'K___ ___ ____'
      )
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
})

describe('handleGuess - players', function () {
  it('should handle progress and shared letter updates', function () {
    const guessObj = new Guess(
      'MCCALL ZERBONI',
      '______ _______',
      [],
      'MELEANA SHIM',
      true
    )
    const result = guessObj.handleGuess()
    assert.deepEqual(result, {
      sharedLetters: [
        ['A', 'L'],
        ['E', 'I', 'N'],
      ],
      progress: 'M_____ _______',
      alignedGuess: 'MELEAN ASHIM!!',
      leftovers: '',
    })

    const guessObj2 = new Guess(
      'MCCALL ZERBONI',
      result.progress,
      result.sharedLetters,
      'SARAH GORDEN',
      true
    )
    const result2 = guessObj2.handleGuess()
    assert.deepEqual(result2, {
      sharedLetters: [['L'], ['E', 'I', 'N', 'O', 'R']],
      progress: 'M__A__ _______',
      alignedGuess: 'SARAHG ORDEN!!',
      leftovers: '',
    })
  })
})

describe('connection handleGuess', function () {
  describe('check each value', function () {
    const guessObj = new Guess(
      'LOUISVILLE 2024',
      '__________ ____',
      [],
      'DASH 2024',
      false
    )

    const result = guessObj.handleGuess()
    it('should assign shared letters for team and season', function () {
      assert.deepEqual(result.sharedLetters, [['S'], []])
    })

    it('should update progress with correct letters and numbers', function () {
      assert.equal(result.progress, '__________ 2024')
    })

    it('should add exclamations to short team guess', function () {
      assert.equal(result.alignedGuess, 'DASH!!!!!! 2024')
    })

    it('should recognize when there are no leftover characters', function () {
      assert.deepEqual(result.leftovers, {
        team: '',
        season: '',
      })
    })
  })
})

describe('connection handleGuess 2', function () {
  it('should handleGuess: answer KANSAS CITY 2014 guess ANGEL CITY 2024', function () {
    const guessObj = new Guess(
      'KANSAS CITYY 2014',
      '______ _____ ____',
      [],
      'ANGEL CITY 2024',
      false
    )

    const result = guessObj.handleGuess()

    const expected = {
      sharedLetters: [['A', 'N'], ['C', 'I', 'T', 'Y'], []],
      progress: '______ _____ 20_4',
      alignedGuess: 'ANGELC ITY!! 2024',
      leftovers: {
        team: '',
        season: '',
      },
    }
    assert.deepEqual(result, expected)
  })
})
