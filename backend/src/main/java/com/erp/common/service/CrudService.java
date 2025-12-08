package com.erp.common.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Generic CRUD service interface.
 * Provides standard CRUD operations for any entity type.
 *
 * @param <T>  Entity type
 * @param <ID> Entity ID type
 */
public interface CrudService<T, ID> {

    /**
     * Creates a new entity.
     */
    T create(T entity);

    /**
     * Retrieves an entity by its ID.
     */
    Optional<T> findById(ID id);

    /**
     * Retrieves all entities.
     */
    List<T> findAll();

    /**
     * Retrieves all entities with pagination.
     */
    Page<T> findAll(Pageable pageable);

    /**
     * Updates an existing entity.
     */
    T update(ID id, T entity);

    /**
     * Deletes an entity by its ID.
     */
    void delete(ID id);

    /**
     * Checks if an entity exists by its ID.
     */
    boolean existsById(ID id);
}

