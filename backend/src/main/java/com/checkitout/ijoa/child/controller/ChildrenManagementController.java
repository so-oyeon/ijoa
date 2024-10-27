package com.checkitout.ijoa.child.controller;

import com.checkitout.ijoa.child.docs.ChildManagementApiDocumentation;
import com.checkitout.ijoa.child.dto.request.CreateChildRequestDto;
import com.checkitout.ijoa.child.dto.response.CreateChildResponseDto;
import com.checkitout.ijoa.child.service.ChildrenManagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/parent")
public class ChildrenManagementController implements ChildManagementApiDocumentation {

    private final ChildrenManagementService childrenManagementService;

    @PostMapping("/children")
    public ResponseEntity<CreateChildResponseDto> createNewChildProfile(
            @Valid @RequestBody CreateChildRequestDto requestDto) {

        CreateChildResponseDto response = childrenManagementService.createNewChildProfile(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
