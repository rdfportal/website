# frozen_string_literal: true

module Rdfportal
  module LangBlocks
    class LangBlock < Liquid::Block
      def initialize(tag_name, markup, tokens)
        super
        @lang_codes = markup.to_s.scan(/"([^"]+)"|'([^']+)'|([^\s]+)/).map do |match|
          match.compact.first.to_s.strip
        end.reject(&:empty?)
      end

      def render(context)
        site = context.registers[:site]
        page = context.registers[:page]
        current_lang = site&.active_lang
        current_lang ||= page&.data&.fetch('lang', nil) if page.respond_to?(:data)
        current_lang ||= context['page'] && context['page']['lang']
        current_lang ||= site&.config&.dig('polyglot', 'default_lang')
        current_lang ||= site&.config&.fetch('default_lang', nil)
        current_lang ||= 'en'

        return '' if @lang_codes.any? && !@lang_codes.include?(current_lang)

        super
      end
    end
  end
end

Liquid::Template.register_tag('lang', Rdfportal::LangBlocks::LangBlock)
