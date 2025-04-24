package hu.fitness.service;

import hu.fitness.converter.ClientConverter;
import hu.fitness.converter.ProgramConverter;
import hu.fitness.domain.Client;
import hu.fitness.domain.Program;
import hu.fitness.dto.ClientRead;
import hu.fitness.dto.ClientUpdate;
import hu.fitness.dto.ProgramRead;
import hu.fitness.exception.ClientNotFoundException;
import hu.fitness.exception.InvalidInputException;
import hu.fitness.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ClientService {
    @Autowired
    private ClientRepository clientRepository;


    public List<ClientRead> listClients() {
        List<ClientRead> clientList = new ArrayList<>();
        List<Client> clients = clientRepository.findAll();
        for (Client client : clients) {
            clientList.add(ClientConverter.convertModelToRead(client));
        }
        return clientList;
    }


    public ClientRead readClient(Integer id) {
        if (!clientRepository.existsById(id)) {
            throw new ClientNotFoundException();
        }
        Client client = clientRepository.getReferenceById(id);
        return ClientConverter.convertModelToRead(client);
    }


    public ClientRead updateClientSelected(int id, ClientUpdate clientUpdate) {
        if (!clientRepository.existsById(id)) {
            throw new ClientNotFoundException();
        }
        Client client = clientRepository.getReferenceById(id);
        switch(clientUpdate.getSelected()){
            case NAME:
                client.setName((String) clientUpdate.getValue());
                break;
            case BIRTH_DATE:
                client.setBirthDate(LocalDate.parse((String) clientUpdate.getValue()));
                break;
            case PHONE_NUMBER:
                client.setPhoneNumber((String) clientUpdate.getValue());
                break;
            default:
                throw new InvalidInputException();
        }
        clientRepository.save(client);
        return ClientConverter.convertModelToRead(client);
    }

    public List<ProgramRead> getProgramsByClientId(Integer id) {
        if (!clientRepository.existsById(id)) {
            throw new ClientNotFoundException();
        }
        List<Program> programs = clientRepository.findProgramsByClientId(id);
        List<ProgramRead> programReads = new ArrayList<>();
        for (Program program : programs) {
            programReads.add(ProgramConverter.convertModelToRead(program));
        }
        return programReads;
    }
}
