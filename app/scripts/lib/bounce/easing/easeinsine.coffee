Easing = require "./index"

class BounceEasing extends Easing

  constructor: (options = {}) ->
    super

    @a = 0.105263
    @a2 = @a * @a
    @om2a = 1 - 2 * @a
    @om2a2 = @om2a * @om2a

  calculate: (ratio) ->
    return 1 if ratio >= 1

    (@a2 + @om2a * ratio + @a2 - 2 * @a * Math.sqrt(@a2 + @om2a * ratio)) / @om2a2

module.exports = BounceEasing