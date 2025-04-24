package hu.fitness.domain;

import hu.fitness.enumeration.Gender;
import hu.fitness.enumeration.Qualification;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Trainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(name = "qualification")
    private Qualification qualification;
    private String phoneNumber;
    private Double rating;

    @OneToOne
    @JoinColumn(name = "login_id")
    private Login login;

    @OneToOne
    @JoinColumn(name = "file_id")
    private FileEntity fileEntity;

}
