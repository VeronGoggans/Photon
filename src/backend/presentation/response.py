from typing import Optional




class JSONResponse:
    def __init__(self, status_code: int, content: Optional[dict] = None):
        self.status_code = status_code
        self.content = content

    


class JSONExceptionResponse:
    def __init__(self, status: int, message: str):
        self.status = status
        self.message = message