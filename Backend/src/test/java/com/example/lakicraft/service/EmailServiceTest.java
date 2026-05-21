package com.example.lakicraft.service;

import com.example.lakicraft.BaseUnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("EmailService Unit Tests")
class EmailServiceTest extends BaseUnitTest {

    private EmailService emailService;

    @Mock
    private JavaMailSender javaMailSender;

    @BeforeEach
    void setUp() {
        emailService = new EmailService(javaMailSender);
    }

    @Test
    @DisplayName("Should return success message when email is sent")
    void testSendEmail_Success() {
        String result = emailService.sendEmail(
                "recipient@example.com",
                "Temat testowy",
                "Treść wiadomości",
                "sender@example.com",
                "Jan Kowalski"
        );

        assertThat(result).isEqualTo("Email wysłany pomyślnie");
        verify(javaMailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    @DisplayName("Should return error message when sending email fails")
    void testSendEmail_Failure() {
        doThrow(new MailException("SMTP error") {
        }).when(javaMailSender).send(any(SimpleMailMessage.class));

        String result = emailService.sendEmail(
                "recipient@example.com",
                "Temat testowy",
                "Treść wiadomości",
                "sender@example.com",
                "Jan Kowalski"
        );

        assertThat(result).startsWith("Błąd wysyłania e-maila:");
        assertThat(result).contains("SMTP error");
    }
}
