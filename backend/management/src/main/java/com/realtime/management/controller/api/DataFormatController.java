package com.realtime.management.controller.api;


import com.realtime.management.dto.dataformat.DataFormatRequest;
import com.realtime.management.dto.dataformat.DataFormatResponse;
import com.realtime.management.entity.DataFormatInfo;
import com.realtime.management.service.dataformat.DataFormatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dformat")
@RequiredArgsConstructor
public class DataFormatController {

    private final DataFormatService dataFormatService;

    @PostMapping("/save")
    public DataFormatResponse save(@Valid @RequestBody DataFormatRequest request){
        return dataFormatService.save(request);
    }

    @PutMapping("/{format_id}")
    public DataFormatResponse update(@PathVariable String format_id,
                                @RequestBody DataFormatRequest request){
        return dataFormatService.update(format_id, request);
    }

    @DeleteMapping("/{format_id}")
    public void delete(@PathVariable String format_id){
        dataFormatService.delete(format_id);
    }

    @GetMapping("/{format_id}")
    public DataFormatResponse findById(@PathVariable String format_id){
        return dataFormatService.findById(format_id);
    }

    @GetMapping("/list")
    public List<DataFormatResponse> findAll(){
        List<DataFormatInfo> infos = dataFormatService.findAll();

        return infos.stream()
                .map(DataFormatResponse::from)
                .toList();
    }

}
