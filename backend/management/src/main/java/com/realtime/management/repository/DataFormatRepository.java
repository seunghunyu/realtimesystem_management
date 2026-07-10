package com.realtime.management.repository;

import com.realtime.management.entity.DataFormatInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DataFormatRepository extends JpaRepository<DataFormatInfo, String> {
    @Query("SELECT MAX(i.formatId) FROM DataFormatInfo i WHERE i.formatId LIKE 'DF%'")
    String findMaxItemId();
}
