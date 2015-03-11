Easing = require "./index"
t = require "timing-function"

class InSineEasing extends Easing

  constructor: (options = {}) ->
    super

  calculate: (ratio) ->
    return 1 if ratio >= 1

    func = t.get(0.47, 0, 0.745, 0.715)    
    func(ratio)

module.exports = InSineEasing
