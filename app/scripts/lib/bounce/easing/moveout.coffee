Easing = require "./index"
t = require "timing-function";

class MoveOut extends Easing

  constructor: (options = {}) ->
    super

  calculate: (ratio) ->
    return 1 if ratio >= 1

    func = t.get(0.11, -0.33, 0.76, -0.03)
    func(ratio)

module.exports = MoveOut
