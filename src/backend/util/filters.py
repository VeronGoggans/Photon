import re

def trucate_note_preview(html: str, max_length: int = 450):
    """
        This function will filter the html content of a note to optimize the 
        frontend DOM performance as it wont have to load the whole html structure
        in the note preview.

        - html (str):       The html content of the note
        - max_length (int): The amount of characters allowed to be displayed

    """
    # Pattern to match opening, closing, and self-closing tags
    tag_pattern = r"</?\w+[^>]*>|[^<]+"  # Matches tags or plain text
    tags_stack = []
    truncated_html = ""
    current_length = 0

    for match in re.finditer(tag_pattern, html):
        token = match.group()
        if token.startswith("<"):  # If it's an HTML tag
            if token.startswith("</"):  # Closing tag
                truncated_html += token
                if tags_stack and tags_stack[-1] == token[2:-1]:
                    tags_stack.pop()
            elif token.endswith("/>"):  # Self-closing tag
                truncated_html += token
            else:  # Opening tag
                truncated_html += token
                tag_name = re.match(r"<(\w+)", token).group(1)
                tags_stack.append(tag_name)
        else:  # Plain text content
            remaining_chars = max_length - current_length
            truncated_html += token[:remaining_chars]
            current_length += len(token[:remaining_chars])
            if current_length >= max_length:
                break

    # Close any remaining unclosed tags
    while tags_stack:
        truncated_html += f"</{tags_stack.pop()}>"

    return truncated_html
