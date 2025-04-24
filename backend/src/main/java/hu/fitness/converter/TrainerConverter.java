package hu.fitness.converter;

import hu.fitness.domain.Trainer;
import hu.fitness.dto.TrainerList;
import hu.fitness.dto.TrainerMinimal;
import hu.fitness.dto.TrainerRead;

import java.util.ArrayList;
import java.util.List;

public class TrainerConverter {
    public static List<TrainerList> convertModelsToLists(List<Trainer> trainers) {
        List<TrainerList> trainerLists = new ArrayList<>();
        for (Trainer trainer : trainers) {
            trainerLists.add(convertModelToList(trainer));
        }
        return trainerLists;
    }

    private static TrainerList convertModelToList(Trainer trainer) {
        TrainerList trainerList = new TrainerList();
        trainerList.setId(trainer.getId());
        trainerList.setName(trainer.getName());
        trainerList.setBirthDate(trainer.getBirthDate());
        trainerList.setGender(trainer.getGender());
        trainerList.setQualification(trainer.getQualification());
        trainerList.setPhoneNumber(trainer.getPhoneNumber());
        trainerList.setRating(trainer.getRating());
        trainerList.setLogin(LoginConverter.convertModelToRead(trainer.getLogin()));
        return trainerList;
    }


    public static TrainerRead convertModelToRead(Trainer trainer) {
        TrainerRead trainerRead = new TrainerRead();
        trainerRead.setId(trainer.getId());
        trainerRead.setName(trainer.getName());
        trainerRead.setBirthDate(trainer.getBirthDate());
        trainerRead.setGender(trainer.getGender());
        trainerRead.setQualification(trainer.getQualification());
        trainerRead.setPhoneNumber(trainer.getPhoneNumber());
        trainerRead.setRating(trainer.getRating());
        trainerRead.setLogin(LoginConverter.convertModelToRead(trainer.getLogin()));
        return trainerRead;
    }


    public static TrainerMinimal convetModelToMinimal(Trainer trainer) {
        TrainerMinimal trainerMinimal = new TrainerMinimal();
        trainerMinimal.setId(trainer.getId());
        trainerMinimal.setName(trainer.getName());
        return trainerMinimal;
    }
}
