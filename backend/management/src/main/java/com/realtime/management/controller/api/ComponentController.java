package com.realtime.management.controller.api;

import com.realtime.management.dto.camp.*;
import com.realtime.management.service.component.ComponentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

/**
 * 컴포넌트 설계에 관련된 모든 API
 */
@Slf4j
@RestController
@RequestMapping("/api/components")
@RequiredArgsConstructor
public class ComponentController {

    private final ComponentService cmpntService;

    //components
    @PostMapping("/{type}/save")
    public ComponentResponse save(@PathVariable("type") String type, @Valid @RequestBody ComponentRequest request){
        // 💡 URL의 {type}과 DTO 내부의 타입이 일치하는지 검증
//        if (!type.equalsIgnoreCase(request.getCmpntType())) {
//            throw new IllegalArgumentException("요청 데이터의 타입이 일치하지 않습니다.");
//        }
        log.info("[/api/components/"+type+"/save]"+request.toString());
        return cmpntService.save(request);
    }

//    @PutMapping("/component/{type}/{cmpntId}")
    @PutMapping("/{type}")
    public ComponentResponse update(@RequestBody ComponentRequest request){
        return cmpntService.update(request);
    }

    @DeleteMapping("/{type}")
    public void deleteCmpnt(@RequestBody ComponentRequest request){
        cmpntService.delete(request);
    }

    @PostMapping("/sch/info")
    public ComponentResponse findByCmpntId(@RequestBody ComponentRequest request){
        return cmpntService.findById(request);
    }

//    @GetMapping("/component/list")
//    public List<ComponentResponse> findCmpntAll(){
//        return cmpntService.findAll();
//    }

}
