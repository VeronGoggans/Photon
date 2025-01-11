from typing import Optional





class JSONResponse:
    """
    Represents a standard API response in JSON format.

    Attributes:
        status_code (int)       : The HTTP status code of the response.
        content (Optional[dict]): The JSON content or body of the response.
    """
    def __init__(self, status_code: int, content: Optional[dict] = None):
        """
        Initializes a JSONResponse object.

        Args:
            status_code (int)       : The HTTP status code of the API response.
            content (Optional[dict]): A dictionary containing the JSON body of the response.
        """
        self.status_code = status_code  # Sets the HTTP status code.
        self.content = content          # Sets the JSON content (optional).





class JSONExceptionResponse:
    """
    Represents an error response in JSON format.

    Attributes:
        status (int) : The HTTP status code of the error.
        message (str): A description or message explaining the error.
    """
    def __init__(self, status: int, message: str):
        """
        Initializes a JSONExceptionResponse object.

        Args:
            status (int) : The HTTP status code of the error response.
            message (str): A string containing the error message or description.
        """
        self.status = status    # Sets the HTTP status code for the error.
        self.message = message  # Sets the error message.
