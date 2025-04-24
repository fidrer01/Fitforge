package hu.fitness.repository;

import hu.fitness.domain.Client;
import hu.fitness.domain.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Integer> {
    @Query("SELECT COUNT(p) FROM Client c JOIN c.programs p WHERE c.id = :clientId")
    Integer countProgramsByClientId(@Param("clientId") Integer clientId);

    @Query("SELECT p FROM Client c JOIN c.programs p WHERE c.id = :clientId")
    List<Program> findProgramsByClientId(@Param("clientId") Integer clientId);

    Optional<Client> getByLoginId(Integer id);
}
