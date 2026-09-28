package com.shiftplanner.controller;

import com.shiftplanner.entity.Shift;
import com.shiftplanner.service.ShiftService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/shifts")
@CrossOrigin(origins = "*")
public class ShiftController {

    private final ShiftService shiftService;

    public ShiftController(ShiftService shiftService) {
        this.shiftService = shiftService;
    }

    // Get all shifts
    @GetMapping
    public List<Shift> getAllShifts() {
        return shiftService.getAllShifts();
    }

    // Get shift by ID
    @GetMapping("/{id}")
    public ResponseEntity<Shift> getShiftById(@PathVariable Long id) {

        return shiftService.getShiftById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create shift
    @PostMapping
public Shift createShift(@Valid @RequestBody Shift shift) {
    return shiftService.createShift(shift);
}

    // Update shift
    @PutMapping("/{id}")
    public ResponseEntity<Shift> updateShift(
            @PathVariable Long id,
            @Valid @RequestBody Shift shift) {

        try {
            return ResponseEntity.ok(
                    shiftService.updateShift(id, shift)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete shift
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShift(@PathVariable Long id) {

        try {
            shiftService.deleteShift(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}