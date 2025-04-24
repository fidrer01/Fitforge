package hu.fitness.service;

import hu.fitness.domain.Allocate;
import hu.fitness.domain.Login;
import hu.fitness.enumeration.Permission;
import hu.fitness.repository.AllocateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class PermissionService {

    @Autowired
    private AllocateRepository allocateRepository;

    public void assignPermissionsForRole(Login login) {
        List<Permission> permissions = switch (login.getRole()) {
            case "CLIENT" -> List.of(
                    Permission.ADD_RATING,
                    Permission.PATCH_CLIENT,
                    Permission.JOIN_PROGRAM,
                    Permission.LEAVE_PROGRAM,
                    Permission.LIST_CLIENTS_PROGRAMS
            );
            case "TRAINER" -> List.of(
                    Permission.CREATE_PROGRAM,
                    Permission.UPDATE_PROGRAM,
                    Permission.DELETE_PROGRAM,
                    Permission.LIST_PROGRAMS_CLIENTS,
                    Permission.PATCH_TRAINER,
                    Permission.UPLOAD_TRAINER_IMAGE,
                    Permission.UPLOAD_BLOG_IMAGE,
                    Permission.CREATE_BLOG,
                    Permission.UPDATE_BLOG,
                    Permission.DELETE_BLOG
            );
            case "ADMIN" -> Arrays.asList(Permission.values());
            default -> throw new IllegalArgumentException("Unknown role: " + login.getRole());
        };

        List<Allocate> allocations = new ArrayList<>();
        for (Permission permission : permissions) {
            Allocate allocate = new Allocate();
            allocate.setLogin(login);
            allocate.setPermission(permission);
            allocations.add(allocate);
        }

        allocateRepository.saveAll(allocations);
    }

}

