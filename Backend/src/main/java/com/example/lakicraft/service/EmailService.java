package com.example.lakicraft.service;

import jakarta.mail.MessagingException; // Import dla MessagingException
import jakarta.mail.internet.MimeMessage;  // Import dla MimeMessage
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    public String sendEmail(String toEmail, String subject, String message, String fromEmail, String userName) {
        try {
            // Tworzenie obiektu wiadomości
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom("matysz21@wp.pl"); // Twój adres jako nadawca
            mailMessage.setTo(toEmail); // Adres odbiorcy (np. Twój e-mail)
            mailMessage.setSubject(subject); // Temat wiadomości
            mailMessage.setText("Wiadomość od: " + userName + " (" + fromEmail + ")\n\n" + message); // Treść wiadomości z imieniem i adresem
    
            // Wysyłanie e-maila
            javaMailSender.send(mailMessage);
            return "Email wysłany pomyślnie";
        } catch (Exception e) {
            // W przypadku błędu
            return "Błąd wysyłania e-maila: " + e.getMessage();
        }
    }
    
    
    
    }


    

