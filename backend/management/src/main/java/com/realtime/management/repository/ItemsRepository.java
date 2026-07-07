package com.realtime.management.repository;

import com.realtime.management.entity.Items;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ItemsRepository extends JpaRepository<Items, String> {
    @Query("SELECT MAX(i.itemId) FROM Items i WHERE i.itemId LIKE 'I%'")
    String findMaxItemId();
}
