package hu.fitness.controller;


import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import hu.fitness.auth.PermissionCollector;
import hu.fitness.converter.LoginConverter;
import hu.fitness.domain.Login;
import hu.fitness.dto.*;
import hu.fitness.service.AuthService;
import hu.fitness.token.JWTTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication and Authorization Controller", description = "Manage Users")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JWTTokenProvider jwtTokenProvider;
    private final AuthService authService;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, JWTTokenProvider jwtTokenProvider, AuthService authService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authService = authService;
    }

    @CrossOrigin
    @PostMapping("/login")
    @Operation(summary = "Login with email and password")
    public ResponseEntity<LoginRead> login(@RequestBody final LoginRequest loginRequest) {
        authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        Login login = authService.findLoginByEmail(loginRequest.getEmail());
        PermissionCollector collector = new PermissionCollector(login);
        HttpHeaders jwtHeader = getJWTHeader(collector);
        LoginRead loginRead = LoginConverter.convertModelToRead(login);
        return new ResponseEntity<>(loginRead, jwtHeader,HttpStatus.OK);
    }

    @CrossOrigin
    @GetMapping("/me")
    @Operation(summary = "Get authenticated User details")
    public ResponseEntity<?> getMe(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            DecodedJWT jwt = JWT.decode(token);
            String email = jwt.getClaim("sub").asString();
            return new ResponseEntity<>(authService.getUserDetailsByEmail(email), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("UNAUTHORIZED", HttpStatus.BAD_REQUEST);
        }
    }

    @CrossOrigin
    @DeleteMapping("/delete")
    @Operation(summary = "Delete authenticated User")
    public ResponseEntity<?> deleteMe(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            DecodedJWT jwt = JWT.decode(token);
            String email = jwt.getClaim("sub").asString();

            authService.deleteUserByEmail(email);
            return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("UNAUTHORIZED", HttpStatus.BAD_REQUEST);
        }
    }

    @CrossOrigin
    @PreAuthorize("hasAuthority('DELETE_USER')")
    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Delete User by Login Id")
    public Object delete(@PathVariable int id) {
        return authService.deleteUserById(id);
    }

    @CrossOrigin
    @PostMapping("/registerClient")
    @Operation(summary = "Register as a Client")
    public ResponseEntity<ClientRead> registerClient(@RequestBody @Valid ClientRegisterRequest request) {
        ClientRead response = authService.registerClient(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @CrossOrigin
    @PostMapping("/registerTrainer")
    @Operation(summary = "Register as a Trainer")
    public ResponseEntity<TrainerRead> registerTrainer(@RequestBody @Valid TrainerRegisterRequest request) {
        TrainerRead response = authService.registerTrainer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    private HttpHeaders getJWTHeader(PermissionCollector collector) {
        HttpHeaders jwtHeader = new HttpHeaders();
        jwtHeader.set("JWT_Token",jwtTokenProvider.generateJwtToken(collector));
        return jwtHeader;
    }

    public void authenticate(String email, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
    }
}
