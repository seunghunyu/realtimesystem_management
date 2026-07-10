package com.realtime.management.service.dataformat;



import com.realtime.management.dto.dataformat.DataFormatRequest;
import com.realtime.management.dto.dataformat.DataFormatResponse;
import com.realtime.management.entity.DataFormatInfo;

import java.util.List;

public interface DataFormatService {
    DataFormatResponse save(DataFormatRequest request);
    DataFormatResponse update(String formatId, DataFormatRequest request);
    void delete(String formatId);
    DataFormatResponse findById(String formatId);
    List<DataFormatInfo> findAll();
}
