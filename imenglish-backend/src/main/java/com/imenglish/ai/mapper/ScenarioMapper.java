package com.imenglish.ai.mapper;

import com.imenglish.ai.document.ScenarioDocument;
import com.imenglish.ai.dto.response.ScenarioResponse;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ScenarioMapper {

    ScenarioResponse toResponse(ScenarioDocument document);

    List<ScenarioResponse> toResponseList(List<ScenarioDocument> documents);
}
