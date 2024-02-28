package com.wenda.demo.resources.questions;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class NewDraftRequest {
    private String title;
    private String description;
}
