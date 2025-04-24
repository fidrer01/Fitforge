package hu.fitness.converter;

import hu.fitness.domain.Client;
import hu.fitness.dto.ClientRead;

public class ClientConverter {

    public static ClientRead convertModelToRead(Client client) {
        ClientRead clientRead = new ClientRead();
        clientRead.setId(client.getId());
        clientRead.setName(client.getName());
        clientRead.setBirthDate(client.getBirthDate());
        clientRead.setGender(client.getGender());
        clientRead.setPhoneNumber(client.getPhoneNumber());
        clientRead.setLogin(LoginConverter.convertModelToRead(client.getLogin()));
        return clientRead;
    }

}
