package hu.fitness.dto;

import hu.fitness.enumeration.ProgramType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProgramSave {

    @NotNull
    private Integer trainerId;
    @NotNull
    private LocalDateTime startTime;
    @NotNull
    private LocalDateTime endTime;
    private Integer price;
    @NotNull
    private Integer capacity;
    @NotNull
    private ProgramType programType;
}
