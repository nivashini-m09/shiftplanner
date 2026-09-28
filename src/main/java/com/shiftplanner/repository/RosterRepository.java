package com.shiftplanner.repository;

import com.shiftplanner.entity.Roster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface RosterRepository extends JpaRepository<Roster, Long> {

    List<Roster> findByEmployeeIdAndRosterDate(
            Long employeeId,
            LocalDate rosterDate
    );
}