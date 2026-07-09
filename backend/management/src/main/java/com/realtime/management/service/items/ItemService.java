package com.realtime.management.service.items;

import com.realtime.management.dto.dept.DeptsRequest;
import com.realtime.management.dto.dept.DeptsResponse;
import com.realtime.management.dto.item.ItemCdTblRequest;
import com.realtime.management.dto.item.ItemCdTblResponse;
import com.realtime.management.dto.item.ItemRequest;
import com.realtime.management.dto.item.ItemResponse;
import com.realtime.management.entity.Depts;
import com.realtime.management.entity.ItemCdTblInfo;
import com.realtime.management.entity.Items;

import java.util.List;

public interface ItemService {
    ItemResponse save(ItemRequest request);
    ItemResponse update(String itemCd, ItemRequest request);
    void delete(String itemCd);
    ItemResponse findById(String itemCd);
    List<Items> findAll();
    List<ItemCdTblInfo> findCdTblAll();
    ItemCdTblResponse save(ItemCdTblRequest request);
}
