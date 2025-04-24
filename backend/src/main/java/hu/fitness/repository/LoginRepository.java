package hu.fitness.repository;

import hu.fitness.domain.Login;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LoginRepository extends JpaRepository<Login, Integer> {
    Optional<Login> findLoginByEmail(String email);

    @Query(nativeQuery = true,
            value = "SELECT p.id FROM permission p " +
                    "INNER JOIN allocate a ON p.id = a.permission_id " +
                    "WHERE a.login_id = :loginId")
    List<String> findPermissionsByUser(@Param("loginId") Integer id);

    boolean existsByEmail(@NotNull String email);
}
