package com.realtime.management.controller.api;

import com.realtime.management.dto.camp.*;
import com.realtime.management.entity.Camp;
import com.realtime.management.service.camp.CampService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 캠페인 설계에 관련된 모든 API
 */
@RestController
@RequestMapping("/api/camp")
@RequiredArgsConstructor
public class CampController {

    private final CampService campService;
    //camp
    @PostMapping("/save")
    public CampResponse save(@Valid @RequestBody CampRequest request){
        return campService.save(request);
    }

    @PutMapping("/{campId}")
    public CampResponse update(@PathVariable String campId,
                               @RequestBody CampRequest request){
        return campService.update(request);
    }

    @DeleteMapping("/{campId}")
    public void delete(@PathVariable String campId){
        campService.delete(campId);
    }

    @GetMapping("/{campId}")
    public CampResponse findById(@PathVariable String campId){
        return campService.findById(campId);
    }

    @GetMapping("/list")
    public List<Camp> findAll(){
        return campService.findAll();
    }


}

