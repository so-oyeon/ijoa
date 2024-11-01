package com.checkitout.ijoa.child.controller;

import com.checkitout.ijoa.child.docs.ChildManagementApiDocumentation;
import com.checkitout.ijoa.child.dto.request.CreateChildRequestDto;
import com.checkitout.ijoa.child.dto.request.UpdateChildRequestDto;
import com.checkitout.ijoa.child.dto.response.ChildDto;
import com.checkitout.ijoa.child.service.ChildrenManagementService;
import com.checkitout.ijoa.common.dto.ResponseDto;
import jakarta.validation.Valid;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/parent")
public class ChildrenManagementController implements ChildManagementApiDocumentation {

    private final ChildrenManagementService childrenManagementService;

    @PostMapping(value = "/children", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ChildDto> createNewChildProfile(
            @Valid @ModelAttribute CreateChildRequestDto requestDto) throws IOException {

        ChildDto response = childrenManagementService.createNewChildProfile(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping(value = "/children/{childId}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE}, produces = {
            MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<ChildDto> updateChildProfile(
            @PathVariable Long childId, @ModelAttribute UpdateChildRequestDto requestDto)
            throws IOException {

        ChildDto response = childrenManagementService.updateChildProfile(childId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/children/{childId}")
    public ResponseEntity<ResponseDto> deleteChildProfile(@PathVariable Long childId){

        ResponseDto response=childrenManagementService.deleteChildProfile(childId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/children/{childId}")
    public ResponseEntity<ChildDto> getChildProfile(@PathVariable Long childId) {

        ChildDto response = childrenManagementService.getChildProfile(childId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @GetMapping("/children")
    public ResponseEntity<List<ChildDto>> getAllChildProfiles() {

        List<ChildDto> response = childrenManagementService.getAllChildProfiles();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
