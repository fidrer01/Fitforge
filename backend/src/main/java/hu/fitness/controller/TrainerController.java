package hu.fitness.controller;

import hu.fitness.dto.*;
import hu.fitness.service.RatingService;
import hu.fitness.service.TrainerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/trainer")
@Tag(name = "Trainer Functions", description = "Manage Trainers")
public class TrainerController {

    @Autowired
    private TrainerService trainerService;

    @Autowired
    private RatingService ratingService;

    @CrossOrigin
    @GetMapping("/")
    @Operation(summary = "List all Trainers")
    public List<TrainerList> readTrainerList() {
        return trainerService.listTrainers();
    }

    @CrossOrigin
    @GetMapping("/bestRatedTrainers")
    @Operation(summary = "Get best rated Trainers")
    public List<TrainerRead> readBestRatedTrainerList() {
        return trainerService.listBestRatedTrainers();
    }

    @CrossOrigin
    @GetMapping("/{id}")
    @Operation(summary = "Get Trainer by id")
    public TrainerRead readTrainer(@PathVariable int id) {
        return trainerService.readTrainer(id);
    }

    @PreAuthorize("hasAuthority('PATCH_TRAINER')")
    @CrossOrigin
    @PatchMapping("/{id}")
    @Operation(summary = "Update Trainer by id")
    public TrainerRead updateTrainer(@PathVariable int id, @Valid @RequestBody TrainerUpdate trainerUpdate) {
        return trainerService.updateTrainerSelected(id, trainerUpdate);
    }

    @CrossOrigin
    @GetMapping("/{id}/rating")
    @Operation(summary = "Get average rating of Trainer by id")
    public Double getAverageRating(@PathVariable int id){
        return trainerService.getAverageRating(id);
    }

    @PreAuthorize("hasAuthority('ADD_RATING')")
    @CrossOrigin
    @PostMapping("/{id}/rating")
    @Operation(summary = "Add rating to Trainer by id")
    public void addRating(@PathVariable int id, @RequestBody @Valid RatingSave ratingSave) {
        ratingService.addRating(id, ratingSave);
    }

    @PreAuthorize("hasAuthority('UPLOAD_TRAINER_IMAGE')")
    @CrossOrigin
    @PutMapping(value="/upload-image/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Update Trainer's image")
    public ResponseEntity<String> updateImage(@RequestParam("file") MultipartFile file, @PathVariable Integer id) throws IOException {
        trainerService.update(file, id);
        return new ResponseEntity<>("Image uploaded successfully", HttpStatus.OK);
    }

    @CrossOrigin
    @GetMapping("/image/{id}")
    @Operation(summary = "Get Trainer's image by ID")
    public ResponseEntity<byte[]> readPicture(@PathVariable int id) {
        return trainerService.getTrainerImage(id);
    }




}
