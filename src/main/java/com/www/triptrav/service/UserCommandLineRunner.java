package com.www.triptrav.service;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserCommandLineRunner implements CommandLineRunner {

    private final UserService userService;

    @Override
    public void run(String... args) {
        userService.insertTestUsersIfEmpty();
    }
}
