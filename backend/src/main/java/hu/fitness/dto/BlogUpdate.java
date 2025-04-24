package hu.fitness.dto;

import hu.fitness.enumeration.BlogType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlogUpdate {

    @NotNull
    private BlogType blogType;
    @NotNull
    @Size(min = 2, max = 100)
    private String title;
    @NotNull
    private String headerText;
    @NotNull
    private String mainText;
}
