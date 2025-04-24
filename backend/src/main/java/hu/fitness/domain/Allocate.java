package hu.fitness.domain;

import hu.fitness.enumeration.Permission;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Allocate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "login_id")
    private Login login;

    @Enumerated(EnumType.STRING)
    @Column(name = "permission_id")
    private Permission permission;

}
