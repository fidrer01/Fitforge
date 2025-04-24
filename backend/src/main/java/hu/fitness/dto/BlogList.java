package hu.fitness.dto;

import hu.fitness.enumeration.BlogType;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlogList {
    private Integer id;
    private String title;
    private String headerText;
    private String mainText;
    private BlogType blogType;
    private TrainerMinimal trainer;
}
