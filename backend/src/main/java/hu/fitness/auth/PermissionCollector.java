package hu.fitness.auth;

import hu.fitness.domain.Login;
import hu.fitness.service.AuthService;
import hu.fitness.service.SpringContext;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class PermissionCollector implements UserDetails {

    private Login login;

    private AuthService authService = SpringContext.getBean(AuthService.class);

    public PermissionCollector(Login login) {
        this.login = login;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<String> permissions = authService.findPermissionsByUser(this.login.getId());
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        permissions.forEach(p -> authorities.add(new SimpleGrantedAuthority(p)));
        return authorities;
    }

    @Override
    public String getPassword() {
        return this.login.getPassword();
    }

    @Override
    public String getUsername() {
        return this.login.getEmail();
    }
}
