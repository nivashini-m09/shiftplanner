package com.shiftplanner.service;

import com.shiftplanner.entity.SwapRequest;
import com.shiftplanner.repository.RosterRepository;
import com.shiftplanner.repository.SwapRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SwapRequestService {

    private final SwapRequestRepository swapRequestRepository;
    private final RosterRepository rosterRepository;
    private final RosterService rosterService;

    public SwapRequestService(
            SwapRequestRepository swapRequestRepository,
            RosterRepository rosterRepository,
            RosterService rosterService) {

        this.swapRequestRepository = swapRequestRepository;
        this.rosterRepository = rosterRepository;
        this.rosterService = rosterService;
    }

    public List<SwapRequest> getAllSwapRequests() {
        return swapRequestRepository.findAll();
    }

    public Optional<SwapRequest> getSwapRequestById(Long id) {
        return swapRequestRepository.findById(id);
    }

    public SwapRequest createSwapRequest(SwapRequest swapRequest) {

        swapRequest.setStatus("PENDING");
        swapRequest.setColleagueApproval("PENDING");
        swapRequest.setManagerApproval("PENDING");
        swapRequest.setRequestedAt(LocalDateTime.now());

        return swapRequestRepository.save(swapRequest);
    }

    public SwapRequest updateSwapRequest(
            Long id,
            SwapRequest requestDetails) {

        SwapRequest request =
                swapRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Swap request not found"));

        request.setRequester(requestDetails.getRequester());
        request.setTargetEmployee(requestDetails.getTargetEmployee());
        request.setRequesterRoster(requestDetails.getRequesterRoster());
        request.setTargetRoster(requestDetails.getTargetRoster());
        request.setReason(requestDetails.getReason());

        return swapRequestRepository.save(request);
    }

    public void deleteSwapRequest(Long id) {

        SwapRequest request =
                swapRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Swap request not found"));

        swapRequestRepository.delete(request);
    }

    // COLLEAGUE APPROVE

    public SwapRequest approveSwapRequest(Long id) {

        SwapRequest request =
                swapRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Swap request not found"));

        if ("REJECTED".equals(request.getColleagueApproval())) {
            throw new RuntimeException(
                    "Swap request was already rejected by colleague");
        }

        if ("APPROVED".equals(request.getColleagueApproval())) {
            throw new RuntimeException(
                    "Colleague has already approved this request");
        }

        request.setColleagueApproval("APPROVED");
        request.setManagerApproval("PENDING");
        request.setStatus("PENDING");

        return swapRequestRepository.save(request);
    }

    // COLLEAGUE REJECT

    public SwapRequest rejectSwapRequest(Long id) {

        SwapRequest request =
                swapRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Swap request not found"));

        if ("APPROVED".equals(request.getColleagueApproval())) {
            throw new RuntimeException(
                    "Colleague has already approved this request");
        }

        request.setColleagueApproval("REJECTED");
        request.setStatus("REJECTED");

        return swapRequestRepository.save(request);
    }

    // MANAGER APPROVE

    public SwapRequest managerApproveSwapRequest(Long id) {

        SwapRequest request =
                swapRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Swap request not found"));

        if (!"APPROVED".equals(request.getColleagueApproval())) {
            throw new RuntimeException(
                    "Manager cannot approve before colleague approval");
        }

        if ("APPROVED".equals(request.getManagerApproval())) {
            throw new RuntimeException(
                    "Manager has already approved this request");
        }

        var requesterRoster = request.getRequesterRoster();
        var targetRoster = request.getTargetRoster();

        var requesterEmployee = requesterRoster.getEmployee();
        var targetEmployee = targetRoster.getEmployee();
        if (!requesterEmployee.getId().equals(
        request.getRequester().getId())) {

    throw new RuntimeException(
            "Requester does not match the selected requester roster");
}

if (!targetEmployee.getId().equals(
        request.getTargetEmployee().getId())) {

    throw new RuntimeException(
            "Target employee does not match the selected target roster");
}

        // Check whether target employee can take requester roster
        rosterService.validateEmployeeShiftChange(
                targetEmployee.getId(),
                requesterRoster,
                requesterRoster.getId()
        );

        // Check whether requester employee can take target roster
        rosterService.validateEmployeeShiftChange(
                requesterEmployee.getId(),
                targetRoster,
                targetRoster.getId()
        );

        // Swap employees
        requesterRoster.setEmployee(targetEmployee);
        targetRoster.setEmployee(requesterEmployee);

        rosterRepository.save(requesterRoster);
        rosterRepository.save(targetRoster);

        request.setManagerApproval("APPROVED");
        request.setStatus("APPROVED");

        return swapRequestRepository.save(request);
    }

    // MANAGER REJECT

    public SwapRequest managerRejectSwapRequest(Long id) {

        SwapRequest request =
                swapRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Swap request not found"));

        request.setManagerApproval("REJECTED");
        request.setStatus("REJECTED");

        return swapRequestRepository.save(request);
    }
}