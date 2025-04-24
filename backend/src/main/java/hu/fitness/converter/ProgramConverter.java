package hu.fitness.converter;

import hu.fitness.domain.Program;
import hu.fitness.domain.Trainer;
import hu.fitness.dto.ProgramRead;
import hu.fitness.dto.ProgramSave;
import hu.fitness.enumeration.ProgramStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ProgramConverter {

    public static ProgramRead convertModelToRead(Program program) {
        ProgramRead programRead = new ProgramRead();
        programRead.setId( program.getId() );
        programRead.setTrainer(TrainerConverter.convetModelToMinimal(program.getTrainer()));
        programRead.setStartTime( program.getStartTime() );
        programRead.setEndTime( program.getEndTime() );
        programRead.setPrice( program.getPrice() );
        programRead.setCapacity( program.getCapacity() );
        programRead.setProgramType( program.getProgramType() );
        programRead.setStatus( program.getStatus() );
        return programRead;
    }

    public static List<ProgramRead> convertModelToReadList(List<Program> programs) {
        List<ProgramRead> programReads = new ArrayList<>();
        for (Program program : programs) {
            programReads.add( convertModelToRead( program ) );
        }
        return programReads;
    }

    public static Program convertSaveToModel(ProgramSave programSave, Trainer trainer) {
        Program program = new Program();
        program.setTrainer( trainer );
        program.setStartTime( programSave.getStartTime() );
        program.setEndTime( programSave.getEndTime() );
        program.setPrice( programSave.getPrice() );
        program.setCapacity( programSave.getCapacity() );
        program.setProgramType( programSave.getProgramType() );
        LocalDateTime time = LocalDateTime.now();
        if (time.isBefore( programSave.getStartTime() )) {
            program.setStatus(ProgramStatus.UPCOMING);
        } else if (time.isAfter( programSave.getEndTime() )) {
            program.setStatus(ProgramStatus.COMPLETED);
        } else {
            program.setStatus(ProgramStatus.ONGOING);
        }
        return program;
    }

    public static Program convertSaveToModel(int id, ProgramSave programSave, Trainer trainer) {
        Program program = new Program();
        program.setId( id );
        program.setTrainer( trainer );
        program.setStartTime( programSave.getStartTime() );
        program.setEndTime( programSave.getEndTime() );
        program.setPrice( programSave.getPrice() );
        program.setCapacity( programSave.getCapacity() );
        program.setProgramType( programSave.getProgramType() );
        LocalDateTime time = LocalDateTime.now();
        if (time.isBefore( programSave.getStartTime() )) {
            program.setStatus(ProgramStatus.UPCOMING);
        } else if (time.isAfter( programSave.getEndTime() )) {
            program.setStatus(ProgramStatus.COMPLETED);
        } else {
            program.setStatus(ProgramStatus.ONGOING);
        }
        return program;
    }
}
