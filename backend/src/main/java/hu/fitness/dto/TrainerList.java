package hu.fitness.dto;

import hu.fitness.enumeration.Gender;
import hu.fitness.enumeration.Qualification;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainerList {

    private Integer id;
    private String name;
    private LocalDate birthDate;
    private Gender gender;
    private Qualification qualification;
    private String phoneNumber;
    private Double rating;
    private LoginRead login;
}
