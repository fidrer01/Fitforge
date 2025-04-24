package hu.fitness.repository;

import hu.fitness.domain.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RatingRepository extends JpaRepository<Rating, Integer> {

    @Query(nativeQuery = true,
            value = "SELECT AVG(r.score) FROM rating r WHERE r.trainer_id = :trainerId")
    Double getAverageRatingByTrainer(@Param("trainerId") Integer trainerId);

}
