package hu.fitness.domain;

import hu.fitness.enumeration.ProgramStatus;
import hu.fitness.enumeration.ProgramType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Program {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id")
    private Trainer trainer;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private Integer price;
    private Integer capacity;

    @Enumerated(EnumType.STRING)
    @Column(name = "program_type", nullable = false)
    private ProgramType programType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProgramStatus status;

    @ManyToMany(mappedBy = "programs")
    private Set<Client> clients = new HashSet<>();
}
