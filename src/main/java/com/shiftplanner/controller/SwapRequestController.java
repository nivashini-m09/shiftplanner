package com.shiftplanner.controller;

import com.shiftplanner.entity.SwapRequest;
import com.shiftplanner.service.SwapRequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/swap-requests")
@CrossOrigin(origins = "*")
public class SwapRequestController {

    private final SwapRequestService swapRequestService;

    public SwapRequestController(
            SwapRequestService swapRequestService) {

        this.swapRequestService = swapRequestService;
    }

    // -----------------------------------------
    // GET ALL SWAP REQUESTS
    // -----------------------------------------

    @GetMapping
    public List<SwapRequest> getAllSwapRequests() {

        return swapRequestService.getAllSwapRequests();
    }

    // -----------------------------------------
    // GET SWAP REQUEST BY ID
    // -----------------------------------------

    @GetMapping("/{id}")
    public ResponseEntity<SwapRequest> getSwapRequestById(
            @PathVariable Long id) {

        return swapRequestService
                .getSwapRequestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // -----------------------------------------
    // CREATE SWAP REQUEST
    // -----------------------------------------

    @PostMapping
    public SwapRequest createSwapRequest(
            @Valid @RequestBody SwapRequest swapRequest) {

        return swapRequestService
                .createSwapRequest(swapRequest);
    }

    // -----------------------------------------
    // UPDATE SWAP REQUEST
    // -----------------------------------------

    @PutMapping("/{id}")
    public ResponseEntity<SwapRequest> updateSwapRequest(
            @PathVariable Long id,
            @Valid @RequestBody SwapRequest swapRequest) {

        try {

            return ResponseEntity.ok(
                    swapRequestService
                            .updateSwapRequest(id, swapRequest)
            );

        } catch (RuntimeException e) {

            return ResponseEntity.notFound().build();
        }
    }

    // -----------------------------------------
    // DELETE SWAP REQUEST
    // -----------------------------------------

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSwapRequest(
            @PathVariable Long id) {

        try {

            swapRequestService.deleteSwapRequest(id);

            return ResponseEntity.noContent().build();

        } catch (RuntimeException e) {

            return ResponseEntity.notFound().build();
        }
    }

    // =========================================
    // COLLEAGUE APPROVAL
    // =========================================

    @PutMapping("/{id}/colleague-approve")
    public ResponseEntity<SwapRequest> colleagueApprove(
            @PathVariable Long id) {

        try {

            return ResponseEntity.ok(
                    swapRequestService
                            .approveSwapRequest(id)
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().build();
        }
    }

    // =========================================
    // COLLEAGUE REJECTION
    // =========================================

    @PutMapping("/{id}/colleague-reject")
    public ResponseEntity<SwapRequest> colleagueReject(
            @PathVariable Long id) {

        try {

            return ResponseEntity.ok(
                    swapRequestService
                            .rejectSwapRequest(id)
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().build();
        }
    }

    // =========================================
    // MANAGER APPROVAL
    // =========================================

    @PutMapping("/{id}/manager-approve")
    public ResponseEntity<SwapRequest> managerApprove(
            @PathVariable Long id) {

        try {

            return ResponseEntity.ok(
                    swapRequestService
                            .managerApproveSwapRequest(id)
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().build();
        }
    }

    // =========================================
    // MANAGER REJECTION
    // =========================================

    @PutMapping("/{id}/manager-reject")
    public ResponseEntity<SwapRequest> managerReject(
            @PathVariable Long id) {

        try {

            return ResponseEntity.ok(
                    swapRequestService
                            .managerRejectSwapRequest(id)
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().build();
        }
    }
}