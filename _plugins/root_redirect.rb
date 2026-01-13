# frozen_string_literal: true
# frozen_string_literal: true

require "fileutils"

Jekyll::Hooks.register :site, :post_write do |site|
  default_lang = site.config["default_lang"] || site.config.dig("polyglot", "default_lang")
  primary_lang = site.config["primary_lang"] || default_lang
  active_lang = site.respond_to?(:active_lang) ? site.active_lang : nil
  # Ensure we only emit the redirect once, during the default language build
  next if default_lang.nil?
  next if primary_lang.nil?
  next if !active_lang.nil? && active_lang != default_lang
  # No redirect necessary if the primary language matches the default output at the root
  next if primary_lang == default_lang

  dest = site.dest
  # If polyglot sets dest to _site/<lang>, move one level up to reach the root output directory
  if active_lang && File.basename(dest) == active_lang
    dest = File.expand_path("..", dest)
  end

  FileUtils.mkdir_p(dest) unless Dir.exist?(dest)

  baseurl = site.config["baseurl"].to_s.strip
  baseurl = "/#{baseurl}" unless baseurl.start_with?("/") || baseurl.empty?
  baseurl = baseurl.chomp("/")

  target = File.join(baseurl, primary_lang.to_s, "/")
  target = target.gsub(%r{//+}, "/")
  target = "/" if target.empty?

  html = <<~HTML
  <!DOCTYPE html>
  <html lang="#{primary_lang}">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="refresh" content="0; url=#{target}" />
        <meta name="robots" content="noindex" />
        <title>Redirecting…</title>
        <script>
          (function () {
            var target = '#{target}';
            if (window.location.pathname === target) return;
            window.location.replace(target);
          })();
        </script>
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
            display: flex;
            min-height: 100vh;
            align-items: center;
            justify-content: center;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <p>Redirecting to the #{primary_lang} top page…</p>
      </body>
    </html>
  HTML

  File.write(File.join(dest, "index.html"), html)
end
