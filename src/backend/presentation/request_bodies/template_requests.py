from pydantic import BaseModel



class PostTemplateRequest(BaseModel):
    """
    - name (str): The name of the template.
    - content (str): The content of the template.
    """
    name: str
    content: str



class PutTemplateRequest(BaseModel):
    """
    - name (str): The name of the template.
    - content (str): The content of the template.
    """
    name: str
    content: str