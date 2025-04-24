package hu.fitness.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRead {

    private int loginId;
    private String email;
    private String role;

}
