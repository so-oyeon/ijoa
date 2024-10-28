package com.checkitout.ijoa.child.mapper;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.child.dto.response.CreateChildResponseDto;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ChildMapper {

    @Mapping(target = "childId", source = "id")
    @Mapping(target = "birth", source = "birth", qualifiedByName = "formatBirth")
    CreateChildResponseDto toCreateChildResponseDto(Child child);

    @Named("formatBirth")
    default String formatBirth(LocalDate birth) {
        return birth != null ? birth.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) : null;
    }
}
