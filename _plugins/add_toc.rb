# If a Markdown file has `toc: true` in its front matter,
# this plugin auto-injects the Kramdown Table of Contents syntax
# at the very beginning of the content before it's rendered.

Jekyll::Hooks.register [:pages, :documents], :pre_render do |doc, payload|
  if doc.data['toc'] && (doc.extname == '.md' || doc.extname == '.markdown')
    unless doc.content.include?('{:toc')
      # The Kramdown syntax * TOC {:toc} will automatically generate the table of contents list.
      doc.content = "<div class=\"toc-view\" markdown=\"1\">\n\n* TOC\n{:toc .page}\n\n</div>\n\n" + doc.content
    end
  end
end
