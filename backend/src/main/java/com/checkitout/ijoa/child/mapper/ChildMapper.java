package com.checkitout.ijoa.child.mapper;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.child.dto.response.ChildDto;
import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ChildMapper {

    @Mapping(target = "childId", source = "id")
    @Mapping(target = "profileUrl", source = "profile")
    @Mapping(target = "birth", source = "birth", qualifiedByName = "formatBirth")
    @Mapping(target = "age", source = "birth", qualifiedByName = "calculateAge")
    ChildDto toChildDto(Child child);

    List<ChildDto> toChildDtoList(List<Child> children);

    @Named("formatBirth")
    default String formatBirth(LocalDate birth) {
        return birth != null ? birth.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) : null;
    }

    @Named("calculateAge")
    default int calculateAge(LocalDate birth) {
        return (birth != null) ? Period.between(birth, LocalDate.now()).getYears() : 0;
    }
}
