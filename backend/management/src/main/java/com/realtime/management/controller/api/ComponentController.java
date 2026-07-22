package com.realtime.management.controller.api;

import com.realtime.management.dto.camp.*;
import com.realtime.management.service.component.ComponentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 컴포넌트 설계에 관련된 모든 API
 */
@RestController
@RequestMapping("/api/component")
@RequiredArgsConstructor
public class ComponentController {

    private final ComponentService cmpntService;

    //components
    @PostMapping("/component/{type}/save")
    public ComponentResponse save(@PathVariable("type") String type, @Valid @RequestBody ComponentRequest request){
        // 💡 URL의 {type}과 DTO 내부의 타입이 일치하는지 검증
        if (!type.equalsIgnoreCase(request.getCmpntType())) {
            throw new IllegalArgumentException("요청 데이터의 타입이 일치하지 않습니다.");
        }
        return cmpntService.save(request);
    }

    @PutMapping("/component/{type}/{cmpntId}")
    public ComponentResponse update(@PathVariable String cmpntId,
                                    @RequestBody ComponentRequest request){
        return cmpntService.update(cmpntId, request);
    }

    @DeleteMapping("/component/{type}/{cmpntId}")
    public void deleteCmpnt(@PathVariable String cmpntId){
        cmpntService.delete(cmpntId);
    }

    @GetMapping("/component/{type}/{cmpntId}")
    public ComponentResponse findByCmpntId(@PathVariable String cmpntId){
        return cmpntService.findById(cmpntId);
    }

//    @GetMapping("/component/list")
//    public List<ComponentResponse> findCmpntAll(){
//        return cmpntService.findAll();
//    }

}
