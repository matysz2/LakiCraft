package com.example.lakicraft.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String email;
    private String password;
    private String role;
    private String accountStatus;
    private String firstName;
    private String lastName;

    @Column(name = "shipping_address")
    private String shippingAddress;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "payment_due_days")
    private Integer paymentDueDays; // Termin płatności w dniach

    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
     // Relacja z LacquerOrder (stolarz jest powiązany z zamówieniem lakierów)
     @OneToMany(mappedBy = "carpenter", fetch = FetchType.EAGER)
     private List<LacquerOrder> lacquerOrders; // Lista zamówień lakierów

    public void setBlocked(boolean b) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setBlocked'");
    }
}
