package hu.fitness.controller;

import hu.fitness.dto.ClientRead;
import hu.fitness.dto.ClientUpdate;
import hu.fitness.service.ClientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/client")
@Tag(name = "Client Functions", description = "Manage Clients")
public class ClientController {


    @Autowired
    private ClientService clientService;

    @PreAuthorize("hasAuthority('LIST_CLIENTS')")
    @CrossOrigin
    @GetMapping("/")
    @Operation(summary = "List all Clients")
    public List<ClientRead> listClients() {
        return clientService.listClients();
    }

    @PreAuthorize("hasAuthority('GET_CLIENT')")
    @CrossOrigin
    @GetMapping("/{id}")
    @Operation(summary = "Get Client by id")
    public ClientRead readClient(@PathVariable int id) {
        return clientService.readClient(id);
    }

    @PreAuthorize("hasAuthority('PATCH_CLIENT')")
    @CrossOrigin
    @PatchMapping("/{id}")
    @Operation(summary = "Update Client by id")
    public ClientRead updateClient(@PathVariable int id, @Valid @RequestBody ClientUpdate clientUpdate) {
        return clientService.updateClientSelected(id, clientUpdate);
    }
}
