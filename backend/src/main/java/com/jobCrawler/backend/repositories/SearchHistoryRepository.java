package com.jobCrawler.backend.repositories;

import com.jobCrawler.backend.models.SearchHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {
    List<SearchHistory> findByUserEmailOrderBySearchedAtDesc(String userEmail);
    
    Optional<SearchHistory> findByUserEmailAndKeyword(String userEmail, String keyword);
    
    @Transactional
    void deleteByUserEmail(String userEmail);
}