package hu.fitness.repository;

import hu.fitness.domain.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TrainerRepository extends JpaRepository<Trainer, Integer> {
    Optional<Trainer> getByLoginId(Integer id);
}
