package com.devopspilot.api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class DevopsPilotApplicationTests {

    @Test
    void contextLoads() {
        // Verifies Spring application context bootstrap and Flyway migration execution
    }
}
