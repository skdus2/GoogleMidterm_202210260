package com.nayeon.diet.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MenuRequest {
    private String name;
    private String category;
    private Long locationId;
}