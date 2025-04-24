package hu.fitness.service;

import hu.fitness.converter.TrainerConverter;
import hu.fitness.domain.FileEntity;
import hu.fitness.domain.Trainer;
import hu.fitness.dto.*;
import hu.fitness.enumeration.Qualification;
import hu.fitness.exception.*;
import hu.fitness.repository.FileRepository;
import hu.fitness.repository.RatingRepository;
import hu.fitness.repository.TrainerRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.*;

import java.io.IOException;

@Service
public class TrainerService {
    @Autowired
    private TrainerRepository trainerRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private FileRepository fileRepository;

    public List<TrainerList> listTrainers() {
        List<TrainerList> trainerList;
        List<Trainer> trainers = trainerRepository.findAll();
        trainerList = TrainerConverter.convertModelsToLists(trainers);
        return trainerList;
    }


    public TrainerRead readTrainer(Integer id) {
        if (!trainerRepository.existsById(id)) {
            throw new TrainerNotFoundException();
        }
        Trainer trainer = trainerRepository.getReferenceById(id);
        return TrainerConverter.convertModelToRead(trainer);
    }


    public Double getAverageRating(Integer trainerId) {
        if (!trainerRepository.existsById(trainerId)) {
            throw new TrainerNotFoundException();
        }
        return ratingRepository.getAverageRatingByTrainer(trainerId);
    }

    @Transactional
    public TrainerRead updateTrainerSelected(int id, TrainerUpdate trainerUpdate) {
        if (!trainerRepository.existsById(id)) {
            throw new TrainerNotFoundException();
        }
        Trainer trainer = trainerRepository.getReferenceById(id);
        switch (trainerUpdate.getSelected()) {
            case NAME:
                trainer.setName((String) trainerUpdate.getValue());
                break;
            case BIRTH_DATE:
                trainer.setBirthDate(LocalDate.parse((String) trainerUpdate.getValue()));
                break;
            case QUALIFICATION:
                trainer.setQualification(Qualification.valueOf((String) trainerUpdate.getValue()));
                break;
            case PHONE_NUMBER:
                trainer.setPhoneNumber((String) trainerUpdate.getValue());
                break;
            default:
                throw new InvalidInputException();
        }
        trainerRepository.save(trainer);
        return TrainerConverter.convertModelToRead(trainer);
    }

    @Transactional
    public void update(MultipartFile file, Integer trainerId) throws IOException {
        if (!trainerRepository.existsById(trainerId)) {
            throw new TrainerNotFoundException();
        }

        Trainer trainer = trainerRepository.getReferenceById(trainerId);
        FileEntity fileEntity = trainer.getFileEntity();

        if (fileEntity == null) {
            fileEntity = new FileEntity();
        }

        fileEntity.setFileName(file.getOriginalFilename());
        fileEntity.setFileType(file.getContentType());
        fileEntity.setData(file.getBytes());

        fileEntity = fileRepository.save(fileEntity);
        trainer.setFileEntity(fileEntity);
        trainerRepository.save(trainer);
    }

    public ResponseEntity<byte[]> getTrainerImage(Integer trainerId) {
        if (!trainerRepository.existsById(trainerId)) {
            throw new TrainerNotFoundException();
        }

        Trainer trainer = trainerRepository.getReferenceById(trainerId);
        FileEntity fileEntity = trainer.getFileEntity();
        if (fileEntity == null) {
            throw new PictureNotFoundException();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(fileEntity.getFileType()))
                .body(fileEntity.getData());
    }


    public List<TrainerRead> listBestRatedTrainers() {
        List<Trainer> trainers = trainerRepository.findAll();
        trainers.sort(Comparator.comparing(Trainer::getRating).reversed());
        List<TrainerRead> bestRatedTrainers = new ArrayList<>();
        int i = 0;
        while (i < trainers.size() && i < 4) {
            bestRatedTrainers.add(TrainerConverter.convertModelToRead(trainers.get(i)));
            i++;
        }
        return bestRatedTrainers;
    }
}
