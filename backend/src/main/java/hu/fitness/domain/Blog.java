package hu.fitness.domain;

import hu.fitness.enumeration.BlogType;
import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Blog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    private BlogType blogType;
    private String title;
    private String headerText;
    private String mainText;

    @ManyToOne
    @JoinColumn(name = "trainer_id")
    private Trainer trainer;

    @OneToOne
    @JoinColumn(name = "file_id")
    private FileEntity fileEntity;
}
