package hu.fitness.exception;

import com.auth0.jwt.exceptions.TokenExpiredException;
import hu.fitness.dto.ExceptionResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.validation.FieldError;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ApplicationExceptionHandler {

    private static final String INCORRECT_CREDENTIALS = "Username / password incorrect. Please try again";
    private static final String NOT_ENOUGH_PERMISSION = "You do not have enough permission";

    private ResponseEntity<ExceptionResponse> createHttpResponse(HttpStatus httpStatus, String message) {
        return new ResponseEntity<>(new ExceptionResponse(httpStatus.value(), httpStatus,
                httpStatus.getReasonPhrase().toUpperCase(), message), httpStatus);
    }

    @ExceptionHandler(EmailTakenException.class)
    public ResponseEntity<ExceptionResponse> emailTakenException() {
        return createHttpResponse(HttpStatus.CONFLICT, "Email taken");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ExceptionResponse> badCredentialsException() {
        return createHttpResponse(HttpStatus.UNAUTHORIZED, INCORRECT_CREDENTIALS);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ExceptionResponse> accessDeniedException() {
        return createHttpResponse(HttpStatus.FORBIDDEN, NOT_ENOUGH_PERMISSION);
    }

    @ExceptionHandler(LoginNotFoundException.class)
    public ResponseEntity<ExceptionResponse> userNotFoundException() {
        return createHttpResponse(HttpStatus.NOT_FOUND, "User not found");
    }

    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<ExceptionResponse> tokenExpiredException(TokenExpiredException exception) {
        return createHttpResponse(HttpStatus.UNAUTHORIZED, exception.getMessage());
    }

    @ExceptionHandler(TrainerNotFoundException.class)
    public ResponseEntity<ExceptionResponse> trainerNotFound() {
        return createHttpResponse(HttpStatus.NOT_FOUND, "Trainer not found");
    }

    @ExceptionHandler(ClientNotFoundException.class)
    public ResponseEntity<ExceptionResponse> clientNotFound() {
        return createHttpResponse(HttpStatus.NOT_FOUND, "Client not found");
    }

    @ExceptionHandler(ProgramNotFoundException.class)
    public ResponseEntity<ExceptionResponse> programNotFound() {
        return createHttpResponse(HttpStatus.NOT_FOUND, "Program not found");
    }

    @ExceptionHandler(BlogNotFoundException.class)
    public ResponseEntity<ExceptionResponse> blogNotFound() {
        return createHttpResponse(HttpStatus.NOT_FOUND, "Blog not found");
    }

    @ExceptionHandler(InvalidInputException.class)
    public ResponseEntity<ExceptionResponse> invalidInputException() {
        return createHttpResponse(HttpStatus.NOT_ACCEPTABLE, "Invalid input");
    }

    @ExceptionHandler(FailedSaveException.class)
    public ResponseEntity<ExceptionResponse> failedSaveException() {
        return createHttpResponse(HttpStatus.EXPECTATION_FAILED, "Failed to save the entity");
    }

    @ExceptionHandler(PictureNotFoundException.class)
    public ResponseEntity<ExceptionResponse> pictureNotFound() {
        return createHttpResponse(HttpStatus.NOT_FOUND, "Picture not found");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponse> handleGenericException(Exception ex) {
        return createHttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred: " + ex.getMessage());
    }
}
