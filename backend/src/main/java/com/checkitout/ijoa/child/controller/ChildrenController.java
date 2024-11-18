package com.checkitout.ijoa.child.controller;

import com.checkitout.ijoa.child.docs.ChildApiDocument;
import com.checkitout.ijoa.child.dto.response.ChildLevelResponseDto;
import com.checkitout.ijoa.child.service.ChildService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/children")
public class ChildrenController implements ChildApiDocument {

    private final ChildService childService;

    @GetMapping("/level")
    public ResponseEntity<ChildLevelResponseDto> getChildProfile() {

        ChildLevelResponseDto response = childService.getChildLevel();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
