package hu.fitness.scheduled;

import hu.fitness.domain.Program;
import hu.fitness.enumeration.ProgramStatus;
import hu.fitness.repository.ProgramRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class ProgramStatusUpdater {

    @Autowired
    private ProgramRepository programRepository;

    @Scheduled(cron = "0 * * * * *")
    public void updateProgramStatuses() {
        LocalDateTime now = LocalDateTime.now();

        List<Program> programs = programRepository.findAll();
        for (Program program : programs) {
            ProgramStatus newStatus;
            if (now.isBefore(program.getStartTime())) {
                newStatus = ProgramStatus.UPCOMING;
            } else if (now.isAfter(program.getEndTime())) {
                newStatus = ProgramStatus.COMPLETED;
            } else {
                newStatus = ProgramStatus.ONGOING;
            }

            if (program.getStatus() != newStatus) {
                program.setStatus(newStatus);
                programRepository.save(program);
            }
        }
    }
}
