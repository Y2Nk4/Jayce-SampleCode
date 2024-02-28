package com.wenda.demo.models;

import com.wenda.demo.models.enums.ContentType;
import com.wenda.demo.models.enums.VoteType;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("votes")
@Data
@Builder
public class Vote {
    @Id
    private String id;

    private String userId;
    private String contentId;
    private ContentType contentType;
    private VoteType voteType;
}
