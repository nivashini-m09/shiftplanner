package com.shiftplanner.repository;

import com.shiftplanner.entity.SwapRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SwapRequestRepository extends JpaRepository<SwapRequest, Long> {
}