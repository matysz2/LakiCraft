package com.example.lakicraft.repository;

import com.example.lakicraft.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

     // Usuwanie terminu
     void deleteById(Integer id);

    // Pobieranie wszystkich terminów dla lakiernika
   List<Appointment> findByUserId(Long userId);

    Optional<Appointment> findById(Integer id);

    List<Appointment> findByUserId(Integer userId);

    List<Appointment> findAllByOrderByIdDesc();

 // Find appointments with status "Wolny" and sort by date ascending
 List<Appointment> findByStatusOrderByDateAsc(String status);
}
