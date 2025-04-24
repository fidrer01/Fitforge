package hu.fitness.repository;

import hu.fitness.domain.Client;
import hu.fitness.domain.Program;
import hu.fitness.domain.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProgramRepository extends JpaRepository<Program, Integer> {
    @Query(value = "SELECT COUNT(c) FROM Program p JOIN p.clients c WHERE p.id = :programId")
    Integer countClientsByProgramId(@Param("programId") Integer programId);

    @Query("SELECT c FROM Program p JOIN p.clients c WHERE p.id = :programId")
    List<Client> findClientsByProgramId(@Param("programId") Integer programId);
    
    void deleteAllByTrainer(Trainer t);
}
