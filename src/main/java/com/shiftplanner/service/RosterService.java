package com.shiftplanner.service;

import com.shiftplanner.entity.Roster;
import com.shiftplanner.entity.Shift;
import com.shiftplanner.repository.RosterRepository;
import org.springframework.stereotype.Service;


import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class RosterService {

    private final RosterRepository rosterRepository;

    public RosterService(RosterRepository rosterRepository) {
        this.rosterRepository = rosterRepository;
    }

    public List<Roster> getAllRosters() {
        return rosterRepository.findAll();
    }

    public Optional<Roster> getRosterById(Long id) {
        return rosterRepository.findById(id);
    }

    public Roster createRoster(Roster roster) {

        validateNoOverlap(roster, null);

        return rosterRepository.save(roster);
    }

    public Roster updateRoster(Long id, Roster rosterDetails) {

        Roster roster = rosterRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Roster not found"));

        roster.setEmployee(rosterDetails.getEmployee());
        roster.setShift(rosterDetails.getShift());
        roster.setRosterDate(rosterDetails.getRosterDate());
        roster.setStatus(rosterDetails.getStatus());

        validateNoOverlap(roster, id);

        return rosterRepository.save(roster);
    }

    public void deleteRoster(Long id) {

        Roster roster = rosterRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Roster not found"));

        rosterRepository.delete(roster);
    }

    private void validateNoOverlap(
            Roster roster,
            Long currentRosterId) {

        if (roster.getEmployee() == null) {
            throw new RuntimeException(
                    "Employee is required");
        }

        if (roster.getShift() == null) {
            throw new RuntimeException(
                    "Shift is required");
        }

        if (roster.getRosterDate() == null) {
            throw new RuntimeException(
                    "Roster date is required");
        }

        Shift newShift = roster.getShift();

        if (newShift.getStartTime() == null ||
                newShift.getEndTime() == null) {

            throw new RuntimeException(
                    "Shift start time and end time are required");
        }

        List<Roster> existingRosters =
                rosterRepository.findByEmployeeIdAndRosterDate(
                        roster.getEmployee().getId(),
                        roster.getRosterDate()
                );

        for (Roster existingRoster : existingRosters) {

            // Ignore the same roster during UPDATE
            if (currentRosterId != null &&
                    existingRoster.getId().equals(currentRosterId)) {
                continue;
            }

            Shift existingShift = existingRoster.getShift();

            if (existingShift == null ||
                    existingShift.getStartTime() == null ||
                    existingShift.getEndTime() == null) {
                continue;
            }

            if (isOverlapping(
                    newShift.getStartTime(),
                    newShift.getEndTime(),
                    existingShift.getStartTime(),
                    existingShift.getEndTime())) {

                throw new RuntimeException(
                        "Employee already has an overlapping shift on "
                        + roster.getRosterDate()
                        + ". Existing shift: "
                        + existingShift.getShiftName());
            }
        }
    }

    private boolean isOverlapping(
            LocalTime newStart,
            LocalTime newEnd,
            LocalTime existingStart,
            LocalTime existingEnd) {

        int newStartMinutes = newStart.getHour() * 60
                + newStart.getMinute();

        int newEndMinutes = newEnd.getHour() * 60
                + newEnd.getMinute();

        int existingStartMinutes = existingStart.getHour() * 60
                + existingStart.getMinute();

        int existingEndMinutes = existingEnd.getHour() * 60
                + existingEnd.getMinute();

        // Handle overnight shifts
        if (newEndMinutes <= newStartMinutes) {
            newEndMinutes += 24 * 60;
        }

        if (existingEndMinutes <= existingStartMinutes) {
            existingEndMinutes += 24 * 60;
        }

        return newStartMinutes < existingEndMinutes
                && existingStartMinutes < newEndMinutes;
    }
    public void validateEmployeeShiftChange(
        Long employeeId,
        Roster newRoster,
        Long currentRosterId) {

    if (employeeId == null) {
        throw new RuntimeException("Employee is required");
    }

    if (newRoster == null || newRoster.getShift() == null) {
        throw new RuntimeException("Shift is required");
    }

    if (newRoster.getRosterDate() == null) {
        throw new RuntimeException("Roster date is required");
    }

    Shift newShift = newRoster.getShift();

    if (newShift.getStartTime() == null ||
            newShift.getEndTime() == null) {

        throw new RuntimeException(
                "Shift start time and end time are required");
    }

    List<Roster> existingRosters =
            rosterRepository.findByEmployeeIdAndRosterDate(
                    employeeId,
                    newRoster.getRosterDate()
            );

    for (Roster existingRoster : existingRosters) {

        if (currentRosterId != null &&
                existingRoster.getId().equals(currentRosterId)) {
            continue;
        }

        Shift existingShift = existingRoster.getShift();

        if (existingShift == null ||
                existingShift.getStartTime() == null ||
                existingShift.getEndTime() == null) {
            continue;
        }

        if (isOverlapping(
                newShift.getStartTime(),
                newShift.getEndTime(),
                existingShift.getStartTime(),
                existingShift.getEndTime())) {

            throw new RuntimeException(
                    "Employee already has an overlapping shift on "
                    + newRoster.getRosterDate()
                    + ". Existing shift: "
                    + existingShift.getShiftName());
        }
    }
}
}
