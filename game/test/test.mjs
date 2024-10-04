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

  describe('sharedLetters', function () {
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

describe('helper functions in handleGuess - links', function () {
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

describe('handleGuess', function () {
  describe('player guesses', function () {
    describe('one part answer', function () {
      it('should handle one part answer and one part guess', function () {
        const guessObj = new Guess('ADRIANA', '_______', [], 'MARTA', true)
        const result = guessObj.handleGuess()
        const expected = {
          sharedLetters: [['A']],
          progress: '__R_A__',
          alignedGuess: 'MARTA!!',
          leftovers: '',
        }
        assert.deepEqual(result, expected)
      })

      it('should handle one part answer and two part guess', function () {
        const guessObj = new Guess(
          'ADRIANA',
          '_______',
          [],
          "LO'EAU LABONTA",
          true
        )
        const result = guessObj.handleGuess()
        const expected = {
          sharedLetters: [['A', 'N']],
          progress: '____A__',
          alignedGuess: "LO'EAUL",
          leftovers: 'ABONTA',
        }
        assert.deepEqual(result, expected)
      })

      it('should handle one part answer and three part guess', function () {
        const guessObj = new Guess(
          'ADRIANA',
          '_______',
          [],
          'LISA DE VANNA',
          true
        )
        const result = guessObj.handleGuess()
        const expected = {
          sharedLetters: [['A', 'D', 'I', 'N']],
          progress: '_______',
          alignedGuess: 'LISADEV',
          leftovers: 'ANNA',
        }
        assert.deepEqual(result, expected)
      })
    })
    describe('two part answer', function () {
      it('should handle two part answer and one part guess', function () {
        const guessObj = new Guess(
          "LO'EAU LABONTA",
          '______ _______',
          [],
          'ADRIANA',
          true
        )
        const result = guessObj.handleGuess()
        const expected = {
          sharedLetters: [[], ['A', 'N']],
          progress: '____A_ _______',
          alignedGuess: 'ADRIAN A!!!!!!',
          leftovers: '',
        }
        assert.deepEqual(result, expected)
      })
      it('should handle two part answer and two part guess', function () {
        const guessObj = new Guess(
          "LO'EAU LABONTA",
          '______ _______',
          [],
          'ANGELINA ANDERSON',
          true
        )
        const result = guessObj.handleGuess()
        const expected = {
          sharedLetters: [
            ['A', 'L', 'O'],
            ['A', 'L', 'N', 'O'],
          ],
          progress: '___E__ _A_____',
          alignedGuess: 'ANGELI NAANDER',
          leftovers: 'SON',
        }
        assert.deepEqual(result, expected)
      })

      it('should handle two part answer and three part guess', function () {
        const guessObj = new Guess(
          "LO'EAU LABONTA",
          '______ _______',
          [],
          'LISA DE VANNA',
          true
        )
        const result = guessObj.handleGuess()
        const expected = {
          sharedLetters: [
            ['A', 'E'],
            ['A', 'L', 'N'],
          ],
          progress: 'L_____ _A_____',
          alignedGuess: 'LISADE VANNA!!',
          leftovers: '',
        }
        assert.deepEqual(result, expected)
      })
    })
    describe('three part answer', function () {
      it('should handle three part answer and one part guess', function () {
        const guessObj = new Guess(
          'LISA DE VANNA',
          '____ __ _____',
          [],
          'ADRIANA',
          true
        )
        const result = guessObj.handleGuess()
        const expected = {
          sharedLetters: [['A', 'I'], ['D'], ['A', 'N']],
          progress: '____ __ _____',
          alignedGuess: 'ADRI AN A!!!!',
          leftovers: '',
        }
        assert.deepEqual(result, expected)
      })
      it('should handle three part answer and two part guess', function () {
        const guessObj = new Guess(
          'LISA DE VANNA',
          '____ __ _____',
          [],
          "LO'EAU LABONTA",
          true
        )
        const result = guessObj.handleGuess()
        const expected = {
          sharedLetters: [['A'], ['E'], ['A', 'N']],
          progress: 'L___ __ _A___',
          alignedGuess: "LO'E AU LABON",
          leftovers: 'TA',
        }
        assert.deepEqual(result, expected)
      })
      it('should handle three part answer and three part guess', function () {
        const guessObj = new Guess(
          'LISA DE VANNA',
          '____ __ _____',
          [],
          'EMILY VAN EGMOND',
          true
        )
        const result = guessObj.handleGuess()
        const expected = {
          sharedLetters: [
            ['A', 'I', 'L'],
            ['D', 'E'],
            ['A', 'N', 'V'],
          ],
          progress: '____ __ _____',
          alignedGuess: 'EMIL YV ANEGM',
          leftovers: 'OND',
        }
        assert.deepEqual(result, expected)
      })
    })
  })
  describe('link guesses', function () {
    describe('one part team answer', function () {
      it('should handle one part answer and one part guess', function () {
        const guessObj = new Guess(
          'GOTHAM 2023',
          '______ ____',
          [],
          'BOSTON 2013',
          false
        )
        const result = guessObj.handleGuess()
        const expected = {
          sharedLetters: [['T'], ['2']],
          progress: '_O____ 20_3',
          alignedGuess: 'BOSTON 2013',
          leftovers: { team: '', season: '' },
        }
        assert.deepEqual(result, expected)
      })
      it('should handle one part answer and two part guess', function () {
        const guessObj = new Guess(
          'GOTHAM 2023',
          '______ ____',
          [],
          'ANGEL CITY 2024',
          false
        )
        const result = guessObj.handleGuess()
        const expected = {
          sharedLetters: [['A', 'G', 'T'], []],
          progress: '______ 202_',
          alignedGuess: 'ANGELC 2024',
          leftovers: { team: 'ITY', season: '' },
        }
        assert.deepEqual(result, expected)
      })
    })
    describe('two part team answer', function () {
      it('should handle two part answer and one part guess', function () {
        const guessObj = new Guess(
          'ANGEL CITY 2024',
          '_____ ____ ____',
          [],
          'GOTHAM 2023',
          false
        )
        const result = guessObj.handleGuess()
        const expected = {
          sharedLetters: [['A', 'G'], ['T'], []],
          progress: '_____ ____ 202_',
          alignedGuess: 'GOTHA M!!! 2023',
          leftovers: { team: '', season: '' },
        }
        assert.deepEqual(result, expected)
      })
      it('should handle two part answer and two part guess', function () {
        const guessObj = new Guess(
          'ANGEL CITY 2024',
          '_____ ____ ____',
          [],
          'KANSAS CITY 2013',
          false
        )
        const result = guessObj.handleGuess()
        const expected = {
          sharedLetters: [['A', 'N'], ['C', 'I', 'T', 'Y'], ['2']],
          progress: '_____ ____ 20__',
          alignedGuess: 'KANSA SCIT 2013',
          leftovers: { team: 'Y', season: '' },
        }
        assert.deepEqual(result, expected)
      })
    })
  })
})

describe('progress and shared letter updates', function () {
  it('should handle sequences for MCCALL ZERBONI', function () {
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
  describe('should handle sequences for KATE DEL FAVA', function () {
    it('should handle guess 1', function () {
      const guess1 = new Guess(
        'KATE DEL FAVA',
        '____ ___ ____',
        [],
        'KATELYN ROWLAND',
        true
      )
      const result1 = guess1.handleGuess()
      assert.deepEqual(result1.sharedLetters, [[], ['D', 'E', 'L'], ['A']])
    })

    it('should handle guess 2', function () {
      const guess2 = new Guess(
        'KATE DEL FAVA',
        'KATE ___ ____',
        [[], ['D', 'E', 'L'], ['A']],
        'TOBIN HEATH',
        true
      )
      const result2 = guess2.handleGuess()
      assert.deepEqual(result2.sharedLetters, [[], ['D', 'E', 'L'], ['A']])
    })
  })
})
