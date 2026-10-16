package com.imenglish.ai.repository;

import com.imenglish.ai.document.ScenarioDocument;
import com.imenglish.enums.EnglishLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScenarioRepository extends MongoRepository<ScenarioDocument, String> {

    Optional<ScenarioDocument> findByCode(String code);

    Optional<ScenarioDocument> findByIdAndIsActiveTrue(String id);

    Page<ScenarioDocument> findByIsActiveTrue(Pageable pageable);

    Page<ScenarioDocument> findByIsActiveTrueAndTopic(String topic, Pageable pageable);

    Page<ScenarioDocument> findByIsActiveTrueAndCefrLevel(EnglishLevel cefrLevel, Pageable pageable);

    Page<ScenarioDocument> findByIsActiveTrueAndTopicAndCefrLevel(String topic, EnglishLevel cefrLevel, Pageable pageable);

    @Query("{ 'isActive': true, $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'description': { $regex: ?0, $options: 'i' } }, { 'topic': { $regex: ?0, $options: 'i' } } ] }")
    Page<ScenarioDocument> searchScenarios(String keyword, Pageable pageable);

    List<ScenarioDocument> findByIsActiveTrueOrderByOrderIndexAsc();
}
