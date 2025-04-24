package hu.fitness.service;

import hu.fitness.converter.ClientConverter;
import hu.fitness.converter.ProgramConverter;
import hu.fitness.domain.Client;
import hu.fitness.domain.Program;
import hu.fitness.domain.Trainer;
import hu.fitness.dto.ClientRead;
import hu.fitness.dto.ProgramRead;
import hu.fitness.dto.ProgramSave;
import hu.fitness.exception.ClientNotFoundException;
import hu.fitness.exception.InvalidInputException;
import hu.fitness.exception.ProgramNotFoundException;
import hu.fitness.exception.TrainerNotFoundException;
import hu.fitness.repository.ClientRepository;
import hu.fitness.repository.ProgramRepository;
import hu.fitness.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProgramService {

    @Autowired
    ProgramRepository programRepository;
    @Autowired
    private TrainerRepository trainerRepository;
    @Autowired
    private ClientRepository clientRepository;

    public ProgramRead readProgram(int id) {
        if (!programRepository.existsById(id) ) {
            throw new ProgramNotFoundException();
        }
        Program program = programRepository.getReferenceById(id);
        return ProgramConverter.convertModelToRead(program);
    }

    public List<ProgramRead> listPrograms() {
        List<ProgramRead> programReads;
        List<Program> programs = programRepository.findAll();
        programReads = ProgramConverter.convertModelToReadList(programs);
        return programReads;
    }

    public ProgramRead createProgram(ProgramSave programSave) {
        if (!trainerRepository.existsById(programSave.getTrainerId())) {
            throw new TrainerNotFoundException();
        }
        Trainer trainer = trainerRepository.getReferenceById(programSave.getTrainerId());
        if (programSave.getEndTime().isBefore(programSave.getStartTime())) {
            throw new InvalidInputException();
        }
        Program program = ProgramConverter.convertSaveToModel(programSave, trainer);
        Program savedProgram = programRepository.save(program);
        return ProgramConverter.convertModelToRead(savedProgram);
    }

    public ProgramRead deleteProgram(int id) {
        if (!programRepository.existsById(id)) {
            throw new ProgramNotFoundException();
        }
        ProgramRead programRead = ProgramConverter.convertModelToRead(programRepository.getReferenceById(id));
        programRepository.deleteById(id);
        return programRead;
    }

    public ProgramRead updateProgram(int id, ProgramSave programSave) {
        if (!programRepository.existsById(id)) {
            throw new ProgramNotFoundException();
        }
        if (!trainerRepository.existsById(programSave.getTrainerId())) {
            throw new TrainerNotFoundException();
        }
        Trainer trainer = trainerRepository.getReferenceById(programSave.getTrainerId());
        Program program = ProgramConverter.convertSaveToModel(id, programSave, trainer);
        Program savedProgram = programRepository.save(program);
        return ProgramConverter.convertModelToRead(savedProgram);
    }

    public void addClientToProgram(int clientId, int programId) {
        if (!programRepository.existsById(programId)) {
            throw new ProgramNotFoundException();
        }
        if (!clientRepository.existsById(clientId)) {
            throw new ClientNotFoundException();
        }
        Program program = programRepository.getReferenceById(programId);
        Client client = clientRepository.getReferenceById(clientId);

        program.getClients().add(client);
        client.getPrograms().add(program);

        programRepository.save(program);
        clientRepository.save(client);
    }

    public void removeClientFromProgram(int clientId, int programId) {
        if (!programRepository.existsById(programId)) {
            throw new ProgramNotFoundException();
        }
        if (!clientRepository.existsById(clientId)) {
            throw new ClientNotFoundException();
        }
        Program program = programRepository.getReferenceById(programId);
        Client client = clientRepository.getReferenceById(clientId);

        program.getClients().remove(client);
        client.getPrograms().remove(program);

        programRepository.save(program);
        clientRepository.save(client);
    }

    public Integer countClients(int programId) {
        return programRepository.countClientsByProgramId(programId);
    }

    public Integer countPrograms(int id) {
        return clientRepository.countProgramsByClientId(id);
    }

    public List<ClientRead> getClientsByProgramId(int id) {
        if (!programRepository.existsById(id)){
            throw new ProgramNotFoundException();
        }
        List<Client> clients = programRepository.findClientsByProgramId(id);
        List<ClientRead> clientReads = new ArrayList<>();
        for (Client client : clients) {
            clientReads.add(ClientConverter.convertModelToRead(client));
        }
        return clientReads;
    }

    public ResponseEntity<Boolean> wasOnProgram(int clientId, int programId) {
        if(!clientRepository.existsById(clientId)){
            throw new ClientNotFoundException();
        }
        if(!programRepository.existsById(programId)){
            throw new ProgramNotFoundException();
        }
        Client client = clientRepository.getReferenceById(clientId);
        boolean wasOnProgram = false;
        for (Program program : client.getPrograms()) {
            if (programId == program.getId()) {
                wasOnProgram = true;
                break;
            }
        }
        if (wasOnProgram) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.ok(false);
        }
    }
}
