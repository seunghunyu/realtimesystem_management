package com.realtime.management.service.items;

import com.realtime.management.dto.item.ItemRequest;
import com.realtime.management.dto.item.ItemResponse;
import com.realtime.management.dto.roles.RolesResponse;
import com.realtime.management.entity.ItemCdTblInfo;
import com.realtime.management.entity.Items;
import com.realtime.management.entity.Roles;
import com.realtime.management.exception.BusinessException;
import com.realtime.management.exception.ErrorCode;
import com.realtime.management.repository.ItemCdTblInfoRepository;
import com.realtime.management.repository.ItemsRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ItemServiceImpl implements ItemService{
    private final ItemsRepository repository;
    private final ItemCdTblInfoRepository itemCdTblInfoRepository;
    @Override
    public ItemResponse save(ItemRequest request) {
        if(repository.existsById(request.getItemNm())){
            throw new BusinessException(ErrorCode.ITEMS_ALREADY_EXISTS);
        }
        ItemCdTblInfo cdTblInfo = null;
        if (request.getCdTblId() != null && !request.getCdTblId().isBlank()) {
            cdTblInfo = itemCdTblInfoRepository.findById(request.getCdTblId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.CDTBL_NOT_FOUND));
        }

        // 💡 1. 아이템 ID가 없거나 공백일 때 자동 생성 로직 작동
        String finalItemId = request.getItemId();
        if (finalItemId == null || finalItemId.isBlank()) {
            finalItemId = generateNextItemId();
        }

        Items items = Items.builder()
                .itemId(finalItemId)
                .itemNm(request.getItemNm())
                .itemAlias(request.getItemAlias())
                .itemDesc(request.getItemDesc())
                .itemType(request.getItemType())
                .itemCdTblInfo(cdTblInfo)
                .build();

        repository.save(items);

        return ItemResponse.from(items);
    }

    @Override
    public ItemResponse update(String itemCd, ItemRequest request) {
        Items items = repository.findById(request.getItemNm())
                .orElseThrow(() -> new BusinessException(ErrorCode.ITEMS_NOT_FOUND));

        ItemCdTblInfo itemCdTblInfo = itemCdTblInfoRepository.findById(request.getCdTblId())
                .orElseThrow(()-> new BusinessException(ErrorCode.CDTBL_NOT_FOUND));

        items.update(items.getItemNm(), request.getItemType(), request.getItemDesc(), itemCdTblInfo);

        return ItemResponse.from(items);
    }

    @Override
    public void delete(String itemNm) {
        Items items = repository.findById(itemNm)
                .orElseThrow(() -> new BusinessException(ErrorCode.ITEMS_NOT_FOUND));

        repository.delete(items);
    }

    @Override
    public ItemResponse findById(String itemNm) {
        Items items = repository.findById(itemNm)
                .orElseThrow(() -> new BusinessException(ErrorCode.ITEMS_NOT_FOUND));
        return ItemResponse.from(items);
    }

    @Override
    public List<Items> findAll() {
        return repository.findAll();
    }

    @Override
    public List<ItemCdTblInfo> findCdTblAll() {
        return itemCdTblInfoRepository.findAll();
    }

    // 💡 2. 다음 순번의 ID를 계산해내는 헬퍼 메서드
    private String generateNextItemId() {
        String maxId = repository.findMaxItemId(); // 예: "I0000005"

        if (maxId == null || maxId.isBlank()) {
            // DB에 데이터가 하나도 없다면 최초의 ID 리턴
            return "I0000001";
        }

        try {
            // "I0000005" 에서 알파벳 "I"를 잘라내고 숫자 "0000005" 문자열만 추출
            String numericPart = maxId.substring(1);
            // 숫자로 변환 (5) 한 뒤 1을 더함 (6)
            int nextNumber = Integer.parseInt(numericPart) + 1;

            // 다시 자릿수(7자리 영문 채움)를 맞춰서 포맷팅 -> "I0000006"
            return String.format("I%07d", nextNumber);
        } catch (Exception e) {
            // 혹시나 포맷이 깨진 기존 데이터가 있을 때를 대비한 방어 코드
            return "I0000001";
        }
    }
}
