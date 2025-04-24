package hu.fitness.dto;


import hu.fitness.enumeration.TrainerUpdateSelected;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainerUpdate {

    private TrainerUpdateSelected selected;
    private Object value;
}
