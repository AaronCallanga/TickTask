package com.callanga.task_manager.repository;

import com.callanga.task_manager.entity.Task;
import com.callanga.task_manager.entity.TaskStatus;
import com.callanga.task_manager.entity.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for Task entity.
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    /**
     * Find all tasks with a specific status.
     */
    List<Task> findByStatus(TaskStatus status);

    /**
     * Find all tasks with a specific priority.
     */
    List<Task> findByPriority(Priority priority);

    /**
     * Find all tasks containing the given title (case-insensitive).
     */
    List<Task> findByTitleContainingIgnoreCase(String title);
}
