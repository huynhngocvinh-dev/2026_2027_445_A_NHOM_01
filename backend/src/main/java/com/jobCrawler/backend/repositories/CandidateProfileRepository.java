package com.jobCrawler.backend.repositories; 

import com.jobCrawler.backend.models.CandidateProfile;
import com.jobCrawler.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, Long> {
    Optional<CandidateProfile> findByUser(User user);
}