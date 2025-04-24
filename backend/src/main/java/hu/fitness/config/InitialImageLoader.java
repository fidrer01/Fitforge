package hu.fitness.config;

import hu.fitness.repository.FileRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class InitialImageLoader implements CommandLineRunner {

    private final ImageLoaderService imageLoaderService;
    private final FileRepository fileRepository;

    public InitialImageLoader(ImageLoaderService imageLoaderService, FileRepository fileRepository) {
        this.imageLoaderService = imageLoaderService;
        this.fileRepository = fileRepository;
    }

    @Override
    public void run(String... args) {
        if (fileRepository.count() == 0) {
            imageLoaderService.loadImages();
        }
    }
}