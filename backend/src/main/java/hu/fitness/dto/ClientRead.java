package hu.fitness.dto;

import hu.fitness.enumeration.Gender;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientRead {
    private Integer id;
    private String name;
    private LocalDate birthDate;
    private Gender gender;
    private String phoneNumber;

    private LoginRead login;
}
