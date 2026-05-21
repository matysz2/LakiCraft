package com.example.lakicraft.repository;

import com.example.lakicraft.model.BusinessCard;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest
@DisplayName("BusinessCardRepository Integration Tests")
class BusinessCardRepositoryTest {

    @Autowired
    private BusinessCardRepository businessCardRepository;

    @Test
    @DisplayName("Should find business card by user id")
    void testFindByUserId() {
        BusinessCard businessCard = new BusinessCard();
        businessCard.setUserId(42L);
        businessCard.setName("Card Owner");
        businessCard.setJobTitle("Builder");
        businessCard.setContactEmail("card@example.com");
        businessCard = businessCardRepository.save(businessCard);

        Optional<BusinessCard> found = businessCardRepository.findByUserId(42L);

        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Card Owner");
    }
}
