package hu.fitness.dto;


import hu.fitness.enumeration.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Data
public class ClientRegisterRequest {
    @NotNull
    @Size(min = 2, max = 50)
    private String name;
    @NotNull
    private LocalDate birthDate;
    @NotNull
    private Gender gender;
    @NotNull
    @Pattern(regexp = "\\d{11}")
    private String phone;
    @NotNull
    @Email
    private String email;
    @NotNull
    private String password;
}
