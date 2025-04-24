package hu.fitness.dto;

import hu.fitness.enumeration.BlogType;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlogRead {
    private Integer id;
    private BlogType blogType;
    private String title;
    private String headerText;
    private String mainText;
    private TrainerMinimal trainer;
}
