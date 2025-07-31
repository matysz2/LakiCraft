package com.example.lakicraft.dto;

import com.example.lakicraft.model.Message;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MessageDTO {

    private Long id;
    private Integer senderId;
    private String senderName;
    private Integer receiverId;
    private String receiverName;
    private Long orderId;
    private String content;
    private LocalDateTime timestamp;

    public MessageDTO(Message message) {
        this.id = message.getId();
        this.senderId = message.getSender().getId();
        this.senderName = message.getSender().getEmail(); // Zamień na inne pole jeśli potrzebujesz
        this.receiverId = message.getReceiver().getId();
        this.receiverName = message.getReceiver().getEmail();
        this.orderId = message.getOrder().getId();
        this.content = message.getContent();
        this.timestamp = message.getTimestamp();
    }
}
