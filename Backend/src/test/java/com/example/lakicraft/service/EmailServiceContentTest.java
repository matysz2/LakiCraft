package com.example.lakicraft.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("EmailService Content Tests")
class EmailServiceContentTest {

    @Mock
    private JavaMailSender javaMailSender;

    @InjectMocks
    private EmailService emailService;

    @Captor
    private ArgumentCaptor<SimpleMailMessage> messageCaptor;

    @Test
    @DisplayName("Should create mail message with all fields")
    void testSendEmail_MessageContent() {
        String to = "customer@example.com";
        String subject = "Hello";
        String message = "This is a test.";
        String from = "sender@example.com";
        String userName = "Jan Kowalski";

        String result = emailService.sendEmail(to, subject, message, from, userName);

        assertThat(result).isEqualTo("Email wysłany pomyślnie");
        verify(javaMailSender, times(1)).send(messageCaptor.capture());

        SimpleMailMessage sentMessage = messageCaptor.getValue();
        assertThat(sentMessage.getTo()).containsExactly(to);
        assertThat(sentMessage.getSubject()).isEqualTo(subject);
        assertThat(sentMessage.getText()).contains("Wiadomość od: Jan Kowalski (sender@example.com)");
        assertThat(sentMessage.getText()).contains(message);
    }
}
