package com.realtime.management.controller.api;

import com.realtime.management.dto.camp.*;
import com.realtime.management.dto.user.UserRequest;
import com.realtime.management.dto.user.UserResponse;
import com.realtime.management.entity.Camp;
import com.realtime.management.entity.Users;
import com.realtime.management.service.camp.CampService;
import com.realtime.management.service.camp.ComponentService;
import com.realtime.management.service.users.UsersService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/camp")
@RequiredArgsConstructor
public class CampController {

    private final CampService campService;
    private final ComponentService cmpntService;
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

    //components
    @PostMapping("/component/save")
    public ComponentResponse save(@Valid @RequestBody ComponentRequest request){
        return cmpntService.save(request);
    }

    @PutMapping("/component/{campId}")
    public ComponentResponse update(@PathVariable String cmpntId,
                               @RequestBody ComponentRequest request){
        return cmpntService.update(cmpntId, request);
    }

    @DeleteMapping("/component/{campId}")
    public void deleteCmpnt(@PathVariable String cmpntId){
        cmpntService.delete(cmpntId);
    }

    @GetMapping("/component/{campId}")
    public ComponentResponse findByCmpntId(@PathVariable String cmpntId){
        return cmpntService.findById(cmpntId);
    }

    @GetMapping("/component/list")
    public List<ComponentResponse> findCmpntAll(){
        return cmpntService.findAll();
    }

    @GetMapping("/brch/list")
    public ResponseEntity<List<HierarchyBrchResponse>> getBrchTree(){
        return ResponseEntity.ok(campService.getBrchTree());
    }
}

