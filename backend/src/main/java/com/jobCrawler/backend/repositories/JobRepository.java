package com.jobCrawler.backend.repositories;

import com.jobCrawler.backend.models.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    @Query("SELECT j FROM Job j WHERE " +
           "(:keyword = '' OR LOWER(j.jobTitle) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:location = '' OR LOWER(j.location) = LOWER(:location))")
    List<Job> searchJobs(
            @Param("keyword") String keyword, 
            @Param("location") String location
    );
    List<Job> findAllByOrderByCreatedAtDesc();
}