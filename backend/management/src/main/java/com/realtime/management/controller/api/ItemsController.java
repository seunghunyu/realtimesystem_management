package com.realtime.management.controller.api;


import com.realtime.management.dto.item.ItemCdTblRequest;
import com.realtime.management.dto.item.ItemCdTblResponse;
import com.realtime.management.dto.item.ItemRequest;
import com.realtime.management.dto.item.ItemResponse;
import com.realtime.management.entity.ItemCdTblInfo;
import com.realtime.management.entity.Items;
import com.realtime.management.service.items.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 아이템 관련된 모든 API
 */
@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemsController {

    private final ItemService service;

    @PostMapping("/save")
    public ItemResponse save(@Valid @RequestBody ItemRequest request){
        return service.save(request);
    }

    @PostMapping("/cdtbl/save")
    public ItemCdTblResponse save(@Valid @RequestBody ItemCdTblRequest request){
        return service.save(request);
    }

    @PutMapping("/{item_id}")
    public ItemResponse update(@PathVariable String item_id,
                                @RequestBody ItemRequest request){
        return service.update(item_id, request);
    }

    @DeleteMapping("/{item_id}")
    public void delete(@PathVariable String item_id){
        service.delete(item_id);
    }

    @GetMapping("/{item_id}")
    public ItemResponse findById(@PathVariable String item_id){
        return service.findById(item_id);
    }

    @GetMapping("/list")
    public List<ItemResponse> findAll(){
        List<Items> items = service.findAll();

        return items.stream()
                .map(ItemResponse::from)
                .toList();
    }

    @GetMapping("/list/cdtbls")
    public List<ItemCdTblResponse> findCdTbls(){
        List<ItemCdTblInfo> itemCdtbls = service.findCdTblAll();

        return itemCdtbls.stream()
                .map(ItemCdTblResponse::from)
                .toList();
    }
}
