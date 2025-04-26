package hu.fitness.config;

import hu.fitness.domain.Blog;
import hu.fitness.domain.FileEntity;
import hu.fitness.domain.Trainer;
import hu.fitness.exception.TrainerNotFoundException;
import hu.fitness.repository.BlogRepository;
import hu.fitness.repository.FileRepository;
import hu.fitness.repository.TrainerRepository;
import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.Map;
import java.util.Optional;

@Service
public class ImageLoaderService {

    private final TrainerRepository trainerRepository;

    private final FileRepository fileRepository;
    private final BlogRepository blogRepository;

    public ImageLoaderService(TrainerRepository trainerRepository, FileRepository fileRepository, BlogRepository blogRepository) {
        this.trainerRepository = trainerRepository;
        this.fileRepository = fileRepository;
        this.blogRepository = blogRepository;
    }

    public void loadImages() {
        loadTrainerImages();
        loadBlogImaes();
    }

    private void loadBlogImaes() {
        Map<Integer, String> blogImageMap = Map.of(
                1,"blog1.jpg",
                2,"blog2.jpg",
                3,"blog3.jpg",
                4,"blog4.jpg",
                5,"blog5.jpg",
                6,"blog6.jpg",
                7,"blog7.jpg",
                8,"blog8.jpg",
                9,"blog9.jpg",
                10,"blog10.jpg"
        );

        for (Map.Entry<Integer, String> entry : blogImageMap.entrySet()) {
            Integer blogId = entry.getKey();
            String imageFileName = entry.getValue();

            try (InputStream inputStream = getClass().getResourceAsStream("/images/" + imageFileName)) {
                byte[] imageBytes = null;
                if (inputStream != null) {
                    imageBytes = IOUtils.toByteArray(inputStream);
                }
                FileEntity file = new FileEntity(imageFileName, "image/jpeg", imageBytes);
                FileEntity savedFile = fileRepository.save(file);

                Optional<Blog> optionalBlog = blogRepository.findById(blogId);
                if (optionalBlog.isPresent()) {
                    Blog blog = optionalBlog.get();
                    blog.setFileEntity(savedFile);
                    blogRepository.save(blog);
                } else {
                    throw new TrainerNotFoundException();
                }

            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }

    private void loadTrainerImages() {
        Map<Integer, String> trainerImageMap = Map.of(
                101, "edzo1.jpg",
                102, "noiedzo4.jpg",
                103,"edzo2.jpg",
                104,"noiedzo2.jpg",
                105,"edzo3.jpg",
                106,"noiedzo3.jpg",
                107,"edzo4.jpg",
                108,"noiedzo1.jpg",
                109,"edzo5.jpg",
                110,"noiedzo5.jpg"

        );

        for (Map.Entry<Integer, String> entry : trainerImageMap.entrySet()) {
            Integer trainerId = entry.getKey();
            String imageFileName = entry.getValue();

            try (InputStream inputStream = getClass().getResourceAsStream("/images/" + imageFileName)) {
                byte[] imageBytes = null;
                if (inputStream != null) {
                    imageBytes = IOUtils.toByteArray(inputStream);
                }
                FileEntity file = new FileEntity(imageFileName, "image/jpeg", imageBytes);
                FileEntity savedFile = fileRepository.save(file);

                Optional<Trainer> optionalTrainer = trainerRepository.findById(trainerId);
                if (optionalTrainer.isPresent()) {
                    Trainer trainer = optionalTrainer.get();
                    trainer.setFileEntity(savedFile);
                    trainerRepository.save(trainer);
                } else {
                    throw new TrainerNotFoundException();
                }

            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }
}