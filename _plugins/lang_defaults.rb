# frozen_string_literal: true

module Rdfportal
  module LangDefaults
    def self.ensure_lang(doc)
      site = doc.respond_to?(:site) ? doc.site : nil
      return unless site

  default_lang = site.config["default_lang"] || site.config.dig("polyglot", "default_lang")
  return unless default_lang

  active_lang = site.respond_to?(:active_lang) ? site.active_lang : nil
  lang = active_lang || doc.data["lang"] || default_lang
  doc.data["lang"] = lang

  canonical = canonical_path_for(doc, lang, default_lang)
      doc.data["canonical_path"] = canonical
      doc.data["page_id"] ||= canonical
    end

    def self.canonical_path_for(doc, lang, default_lang)
      path = doc.url || doc.data["permalink"] || "/"
      path = path.to_s
      path = "/" if path.empty?
      path = "/#{path}" unless path.start_with?("/")

      return path if path == "/"

      lang ||= default_lang
      if lang && lang != default_lang
        lang_prefix = "/#{lang}"
        lang_prefix_with_slash = "#{lang_prefix}/"
        if path == lang_prefix
          path = "/"
        elsif path.start_with?(lang_prefix_with_slash)
          path = path.sub(lang_prefix_with_slash, "/")
        end
      end

      path
    end
  end
end

Jekyll::Hooks.register [:pages, :documents, :posts], :pre_render do |doc|
  Rdfportal::LangDefaults.ensure_lang(doc)
end
