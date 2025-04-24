package hu.fitness.repository;

import hu.fitness.domain.Allocate;
import hu.fitness.domain.Login;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AllocateRepository extends JpaRepository<Allocate, Integer> {
    void deleteByLogin(Login login);
}
