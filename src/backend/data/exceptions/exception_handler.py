from src.backend.data.exceptions.exceptions import *
from src.backend.presentation.http_status import HttpStatus
from src.backend.presentation.response import JSONExceptionResponse
from functools import wraps



def handle_exceptions(func) -> ( InvalidMoveRequestException | NotFoundException ):
    
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs) # Return the original function 
        
        except ValueError as e:
            return JSONExceptionResponse(status=HttpStatus.BAD_REQUEST, message=str(e))
        
        except NotFoundException as e:
            return JSONExceptionResponse(status=HttpStatus.NOT_FOUND, message=str(e))
    
        
    return wrapper 