package hu.fitness.converter;

import hu.fitness.domain.Login;
import hu.fitness.dto.LoginRead;

public class LoginConverter {

    public static LoginRead convertModelToRead(Login login) {
        LoginRead loginRead = new LoginRead();
        loginRead.setLoginId(login.getId());
        loginRead.setEmail(login.getEmail());
        loginRead.setRole(login.getRole());
        return loginRead;
    }
}
