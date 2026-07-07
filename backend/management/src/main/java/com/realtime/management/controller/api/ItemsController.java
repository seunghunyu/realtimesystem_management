package com.realtime.management.controller.api;


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

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemsController {

    private final ItemService service;

    @PostMapping("/save")
    public ItemResponse save(@Valid @RequestBody ItemRequest request){
        return service.save(request);
    }

    @PutMapping("/{role_cd}")
    public ItemResponse update(@PathVariable String role_cd,
                                @RequestBody ItemRequest request){
        return service.update(role_cd, request);
    }

    @DeleteMapping("/{role_cd}")
    public void delete(@PathVariable String role_cd){
        service.delete(role_cd);
    }

    @GetMapping("/{role_cd}")
    public ItemResponse findById(@PathVariable String role_cd){
        return service.findById(role_cd);
    }

    @GetMapping("/list")
    public List<ItemResponse> findAll(){
        List<Items> items = service.findAll();

        return items.stream()
                .map(ItemResponse::from)
                .toList();
    }

    @GetMapping("/cdtbls")
    public List<ItemCdTblResponse> findCdTbls(){
        List<ItemCdTblInfo> itemCdtbls = service.findCdTblAll();

        return itemCdtbls.stream()
                .map(ItemCdTblResponse::from)
                .toList();
    }
}
