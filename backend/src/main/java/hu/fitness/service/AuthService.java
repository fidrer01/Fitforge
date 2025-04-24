package hu.fitness.service;

import java.io.InputStream;
import hu.fitness.auth.PermissionCollector;
import hu.fitness.converter.ClientConverter;
import hu.fitness.converter.LoginConverter;
import hu.fitness.converter.TrainerConverter;
import hu.fitness.domain.*;
import hu.fitness.dto.*;
import hu.fitness.exception.*;
import hu.fitness.repository.*;
import jakarta.transaction.Transactional;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AuthService implements UserDetailsService {


    private final LoginRepository loginRepository;
    private final ClientRepository clientRepository;
    private final TrainerRepository trainerRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileRepository fileRepository;
    private final ProgramRepository programRepository;
    private final BlogRepository blogRepository;
    private final PermissionService permissionService;
    private final AllocateRepository allocateRepository;


    @Autowired
    public AuthService(LoginRepository loginRepository, ClientRepository clientRepository, TrainerRepository trainerRepository, PasswordEncoder passwordEncoder, FileRepository fileRepository, ProgramRepository programRepository, BlogRepository blogRepository, PermissionService permissionService, AllocateRepository allocateRepository) {
        this.loginRepository = loginRepository;
        this.clientRepository = clientRepository;
        this.trainerRepository = trainerRepository;
        this.passwordEncoder = passwordEncoder;
        this.fileRepository = fileRepository;
        this.programRepository = programRepository;
        this.blogRepository = blogRepository;
        this.permissionService = permissionService;
        this.allocateRepository = allocateRepository;
    }

    public List<String> findPermissionsByUser(Integer id) {
        return loginRepository.findPermissionsByUser(id);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return loginRepository.findLoginByEmail(username)
                .map(PermissionCollector::new)
                .orElseThrow(() -> new UsernameNotFoundException("Felhasználó nem található: " + username));
    }


    public Login findLoginByEmail(final String email) {
        return loginRepository.findLoginByEmail(email)
                .orElseThrow(LoginNotFoundException::new);
    }

    public Object getUserDetailsByEmail(String email) {
        Login login = findLoginByEmail(email);
        Integer id = login.getId();
        String role = login.getRole();
        return switch (role) {
            case "CLIENT" -> ClientConverter.convertModelToRead(clientRepository.getByLoginId(id)
                    .orElseThrow(ClientNotFoundException::new));
            case "TRAINER" -> TrainerConverter.convertModelToRead(trainerRepository.getByLoginId(id)
                    .orElseThrow(TrainerNotFoundException::new));
            default -> LoginConverter.convertModelToRead(login);
        };
    }

    public void deleteUserByEmail(String email) {
        Login login = findLoginByEmail(email);
        String role = login.getRole();
        switch (role) {
            case "CLIENT" ->
                deleteClient(clientRepository.getByLoginId(login.getId()));
            case "TRAINER" ->
                deleteTrainer(trainerRepository.getByLoginId(login.getId()));
            case "ADMIN" ->
                throw new AccessDeniedException("ACCESS_DENIED");
        }
    }

    public void deleteTrainer(Optional<Trainer> trainer) {
        if (trainer.isPresent()) {
            Trainer t = trainer.get();
            List<Blog> blogs = blogRepository.findAllByTrainer(t);
            for (Blog blog : blogs) {
                if (blog.getFileEntity()!=null) {
                    fileRepository.delete(blog.getFileEntity());
                }
            }
            blogRepository.deleteAll(blogs);

            programRepository.deleteAllByTrainer(t);

            if (t.getFileEntity()!=null) {
                fileRepository.delete(t.getFileEntity());
            }
            Login login = t.getLogin();

            trainerRepository.delete(t);

            allocateRepository.deleteByLogin(login);
            loginRepository.delete(login);
        } else {
            throw new TrainerNotFoundException();
        }
    }

    public void deleteClient(Optional<Client> client) {
        if (client.isPresent()) {
            Client c = client.get();
            for (Program program : c.getPrograms()) {
                program.getClients().remove(c);
            }
            programRepository.saveAll(c.getPrograms());

            Login login = c.getLogin();
            clientRepository.delete(c);

            allocateRepository.deleteByLogin(login);
            loginRepository.delete(login);
        } else {
            throw new ClientNotFoundException();
        }
    }

    public ClientRead registerClient(ClientRegisterRequest request) {
        if (loginRepository.existsByEmail(request.getEmail())) {
            throw new EmailTakenException();
        }

        Login login = new Login();
        login.setEmail(request.getEmail());
        login.setPassword(passwordEncoder.encode(request.getPassword()));
        login.setRole("CLIENT");

        Login savedLogin = loginRepository.save(login);

        permissionService.assignPermissionsForRole(savedLogin);

        Client client = new Client();
        client.setLogin(savedLogin);
        client.setName(request.getName());
        client.setBirthDate(request.getBirthDate());
        client.setGender(request.getGender());
        client.setPhoneNumber(request.getPhone());
        client.setPrograms();

        Client savedClient = clientRepository.save(client);

        return ClientConverter.convertModelToRead(savedClient);
    }

    public TrainerRead registerTrainer(TrainerRegisterRequest request) {
        if (loginRepository.existsByEmail(request.getEmail())) {
            throw new EmailTakenException();
        }

        Login login = new Login();
        login.setEmail(request.getEmail());
        login.setPassword(passwordEncoder.encode(request.getPassword()));
        login.setRole("TRAINER");

        Login savedLogin = loginRepository.save(login);

        permissionService.assignPermissionsForRole(savedLogin);

        Trainer trainer = new Trainer();
        trainer.setLogin(savedLogin);
        trainer.setName(request.getName());
        trainer.setPhoneNumber(request.getPhoneNumber());
        trainer.setBirthDate(request.getBirthDate());
        trainer.setGender(request.getGender());
        trainer.setQualification(request.getQualification());
        trainer.setRating(0.0);

        FileEntity fileEntity;
        try {
            InputStream inputStream = getClass().getResourceAsStream("/images/default_image.jpg");
            assert inputStream != null;
            byte[] defaultImage = IOUtils.toByteArray(inputStream);
            fileEntity = new FileEntity("default_image.jpg", "image/jpeg", defaultImage);
        } catch (IOException e) {
            throw new FailedSaveException();
        }

        fileEntity = fileRepository.save(fileEntity);

        trainer.setFileEntity(fileEntity);

        Trainer savedTrainer = trainerRepository.save(trainer);

        return TrainerConverter.convertModelToRead(savedTrainer);
    }


    public Object deleteUserById(int loginId) {
        if (!loginRepository.existsById(loginId)) {
            throw new LoginNotFoundException();
        }
        Login login = loginRepository.getReferenceById(loginId);
        String role = login.getRole();
        switch (role) {
            case "CLIENT" -> {
                Optional<Client> optionalClient = clientRepository.getByLoginId(loginId);
                if (optionalClient.isPresent()) {
                    Client client = optionalClient.get();
                    ClientRead clientRead = ClientConverter.convertModelToRead(client);
                    deleteClient(optionalClient);
                    return clientRead;
                }
            }

            case "TRAINER" -> {
                Optional<Trainer> optionalTrainer = trainerRepository.getByLoginId(loginId);
                if (optionalTrainer.isPresent()) {
                    Trainer trainer = optionalTrainer.get();
                    TrainerRead trainerRead = TrainerConverter.convertModelToRead(trainer);
                    deleteTrainer(optionalTrainer);
                    return trainerRead;
                }
            }

            case "ADMIN" -> throw new AccessDeniedException("ACCESS_DENIED");
        }
        return null;
    }
}