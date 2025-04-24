package hu.fitness.repository;

import hu.fitness.domain.Blog;
import hu.fitness.domain.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlogRepository extends JpaRepository<Blog, Integer> {

    List<Blog> findAllByTrainer(Trainer t);
}
