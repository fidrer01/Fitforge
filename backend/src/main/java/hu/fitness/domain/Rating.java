package hu.fitness.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.validator.constraints.Range;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "trainer_id")
    private Trainer trainer;

    @Range(min = 1, max = 5)
    private Double score;
}
