package hu.fitness.dto;

import hu.fitness.enumeration.ClientUpdateSelected;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientUpdate {

    private ClientUpdateSelected selected;
    private Object value;
}
