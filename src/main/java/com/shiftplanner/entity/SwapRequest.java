package com.shiftplanner.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "swap_requests")
public class SwapRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "requester_id", nullable = false)
    private Employee requester;

    @ManyToOne
    @JoinColumn(name = "target_employee_id", nullable = false)
    private Employee targetEmployee;

    @ManyToOne
    @JoinColumn(name = "requester_roster_id", nullable = false)
    private Roster requesterRoster;

    @ManyToOne
    @JoinColumn(name = "target_roster_id", nullable = false)
    private Roster targetRoster;

    @NotBlank
    private String reason;

    private String status;

    private String colleagueApproval;

    private String managerApproval;

    private LocalDateTime requestedAt;

    public SwapRequest() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employee getRequester() {
        return requester;
    }

    public void setRequester(Employee requester) {
        this.requester = requester;
    }

    public Employee getTargetEmployee() {
        return targetEmployee;
    }

    public void setTargetEmployee(Employee targetEmployee) {
        this.targetEmployee = targetEmployee;
    }

    public Roster getRequesterRoster() {
        return requesterRoster;
    }

    public void setRequesterRoster(Roster requesterRoster) {
        this.requesterRoster = requesterRoster;
    }

    public Roster getTargetRoster() {
        return targetRoster;
    }

    public void setTargetRoster(Roster targetRoster) {
        this.targetRoster = targetRoster;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getColleagueApproval() {
        return colleagueApproval;
    }

    public void setColleagueApproval(String colleagueApproval) {
        this.colleagueApproval = colleagueApproval;
    }

    public String getManagerApproval() {
        return managerApproval;
    }

    public void setManagerApproval(String managerApproval) {
        this.managerApproval = managerApproval;
    }

    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(LocalDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }
}