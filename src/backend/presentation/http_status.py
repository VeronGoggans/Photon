from enum import Enum



class HttpStatus(Enum):
    OK = 200                        # Request succesfull
    CREATED = 201                   # Resource created successfuly
    NO_CONTENT = 204                # Request succesfull, but no return value
    INTERNAL_SERVER_ERROR = 500     # Error on the server side
    NOT_FOUND = 404                 # The specified recource could not be found
    BAD_REQUEST = 400               # The client provided an incomplete request 
    