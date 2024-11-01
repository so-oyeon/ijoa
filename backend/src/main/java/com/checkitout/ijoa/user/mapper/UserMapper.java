package com.checkitout.ijoa.user.mapper;

import com.checkitout.ijoa.user.domain.User;
import com.checkitout.ijoa.user.dto.UserDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "userId", source = "id")
    UserDto toUserDto(User user);
}
