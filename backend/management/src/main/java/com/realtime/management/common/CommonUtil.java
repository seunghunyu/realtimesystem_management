package com.realtime.management.common;

import com.realtime.management.repository.CampRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CommonUtil {
    private final CampRepository campRepository;
    private String generateNextItemId(String type) {
        String prefix = "C";
        if(type.equals(GEN_KEY_CODE.CAMP.getCode())){
            prefix = GEN_KEY_CODE.CAMP.getPrefix();
        }else if(type.equals(GEN_KEY_CODE.COMPONENT.getCode())){
            prefix = GEN_KEY_CODE.CAMP.getPrefix();
        }else if(type.equals(GEN_KEY_CODE.CAMP.getCode())){
            prefix = GEN_KEY_CODE.ITEM.getPrefix();
        }

        String maxId = campRepository.findMaxCampId(); // 예: "I0000005"

        if (maxId == null || maxId.isBlank()) {
            // DB에 데이터가 하나도 없다면 최초의 ID 리턴
            return prefix + "0000001";
        }

        try {
            // "I0000005" 에서 알파벳 "I"를 잘라내고 숫자 "0000005" 문자열만 추출
            String numericPart = maxId.substring(1);
            // 숫자로 변환 (5) 한 뒤 1을 더함 (6)
            int nextNumber = Integer.parseInt(numericPart) + 1;

            // 다시 자릿수(7자리 영문 채움)를 맞춰서 포맷팅 -> "I0000006"
            return String.format(prefix + "%07d", nextNumber);
        } catch (Exception e) {
            // 혹시나 포맷이 깨진 기존 데이터가 있을 때를 대비한 방어 코드
            return prefix + "0000001";
        }
    }
}
