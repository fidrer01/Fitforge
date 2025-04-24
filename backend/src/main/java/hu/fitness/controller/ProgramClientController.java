package hu.fitness.controller;

import hu.fitness.dto.ClientRead;
import hu.fitness.dto.ProgramRead;
import hu.fitness.service.ClientService;
import hu.fitness.service.ProgramService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Program Client Functions", description = "Manage Programs and Clients")
public class ProgramClientController {
    @Autowired
    private ClientService clientService;
    @Autowired
    private ProgramService programService;

    @PreAuthorize("hasAuthority('JOIN_PROGRAM')")
    @CrossOrigin
    @PostMapping("/program/{programId}/clients/{clientId}")
    @Operation(summary = "Add Client to Program by id")
    public ResponseEntity<String> registerClientToProgram(@PathVariable int clientId, @PathVariable int programId) {
        programService.addClientToProgram(clientId,programId);
        return new ResponseEntity<>("Successful registration.", HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('LEAVE_PROGRAM')")
    @CrossOrigin
    @DeleteMapping("/program/{programId}/clients/{clientId}")
    @Operation(summary = "Remove Client from Program by id")
    public ResponseEntity<String> removeClientFromProgram(@PathVariable int clientId, @PathVariable int programId) {
        programService.removeClientFromProgram(clientId,programId);
        return new ResponseEntity<>("Client successfully removed.",HttpStatus.OK);
    }

    @CrossOrigin
    @GetMapping("/program/{id}/client-count")
    @Operation(summary = "Count how many Clients registered for Program")
    public ResponseEntity<Integer> countClients(@PathVariable int id) {
        return new ResponseEntity<>(programService.countClients(id), HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('LIST_PROGRAMS_CLIENTS')")
    @CrossOrigin
    @GetMapping("/program/{id}/client-list")
    @Operation(summary = "List joined Clients by id")
    public List<ClientRead> listClients(@PathVariable int id) {
        return programService.getClientsByProgramId(id);
    }

    @CrossOrigin
    @GetMapping("/program/{programId}/clients/{clientId}")
    @Operation(summary = "See if the Client was on the Program")
    public ResponseEntity<Boolean> wasOnProgram(@PathVariable int clientId, @PathVariable int programId) {
        return programService.wasOnProgram(clientId,programId);
    }


    @CrossOrigin
    @GetMapping("/client/{id}/program-count")
    @Operation(summary = "Count how many Programs the Client registered for")
    public ResponseEntity<Integer> countPrograms(@PathVariable int id) {
        return new ResponseEntity<>(programService.countPrograms(id),HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('LIST_CLIENTS_PROGRAMS')")
    @CrossOrigin
    @GetMapping("/client/{id}/program-list")
    @Operation(summary = "List joined Programs by id")
    public List<ProgramRead> readJoinedPrograms(@PathVariable int id) {
        return clientService.getProgramsByClientId(id);
    }
}
