package com.shiftplanner.controller;

import com.shiftplanner.entity.Roster;
import com.shiftplanner.service.RosterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/rosters")
@CrossOrigin(origins = "*")
public class RosterController {

    private final RosterService rosterService;

    public RosterController(RosterService rosterService) {
        this.rosterService = rosterService;
    }

    // Get all rosters
    @GetMapping
    public List<Roster> getAllRosters() {
        return rosterService.getAllRosters();
    }

    // Get roster by ID
    @GetMapping("/{id}")
    public ResponseEntity<Roster> getRosterById(@PathVariable Long id) {

        return rosterService.getRosterById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create roster
    @PostMapping
public Roster createRoster(@Valid @RequestBody Roster roster) {
    return rosterService.createRoster(roster);
}

    // Update roster
    @PutMapping("/{id}")
public ResponseEntity<Roster> updateRoster(
        @PathVariable Long id,
        @Valid @RequestBody Roster roster)  {

        try {
            return ResponseEntity.ok(
                    rosterService.updateRoster(id, roster)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete roster
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoster(@PathVariable Long id) {

        try {
            rosterService.deleteRoster(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
