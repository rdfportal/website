module Jekyll
  module TagColorFilter
    # Returns hex color for a tag id using a hash-based HSL derivation.
    def tag_color(input)
      tag = input.to_s
      hash = 0
      tag.each_byte do |b|
        hash = ((hash << 5) - hash + b) & 0xffffffff
      end
      h = (hash.abs % 360)
      s = 65 + (hash.abs % 25)
      l = 25 + (hash.abs % 20)
      hsl_to_hex(h, s, l)
    end

    private
    def hsl_to_hex(h, s, l)
      s = s.to_f / 100.0
      l = l.to_f / 100.0
      c = (1 - (2 * l - 1).abs) * s
      hp = h.to_f / 60.0
      x = c * (1 - ((hp % 2) - 1).abs)
      r1 = g1 = b1 = 0.0
      case hp.floor
      when 0
        r1, g1, b1 = c, x, 0
      when 1
        r1, g1, b1 = x, c, 0
      when 2
        r1, g1, b1 = 0, c, x
      when 3
        r1, g1, b1 = 0, x, c
      when 4
        r1, g1, b1 = x, 0, c
      when 5
        r1, g1, b1 = c, 0, x
      end
      m = l - c / 2.0
      r = ((r1 + m) * 255).round.clamp(0,255)
      g = ((g1 + m) * 255).round.clamp(0,255)
      b = ((b1 + m) * 255).round.clamp(0,255)
      "##{r.to_s(16).rjust(2,'0')}#{g.to_s(16).rjust(2,'0')}#{b.to_s(16).rjust(2,'0')}"
    end
  end
end

Liquid::Template.register_filter(Jekyll::TagColorFilter)
