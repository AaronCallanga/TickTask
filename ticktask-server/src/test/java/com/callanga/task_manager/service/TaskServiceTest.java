package com.callanga.task_manager.service;

import com.callanga.task_manager.dto.TaskRequest;
import com.callanga.task_manager.dto.TaskResponse;
import com.callanga.task_manager.entity.Priority;
import com.callanga.task_manager.entity.Task;
import com.callanga.task_manager.entity.TaskStatus;
import com.callanga.task_manager.exception.TaskNotFoundException;
import com.callanga.task_manager.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for TaskService.
 * Uses mocked repository - no database required.
 */
@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    private Task sampleTask;

    @BeforeEach
    void setUp() {
        sampleTask = Task.builder()
                .id(1L)
                .title("Test Task")
                .description("Test description")
                .status(TaskStatus.TODO)
                .priority(Priority.MEDIUM)
                .dueDate(LocalDate.now().plusDays(7))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("createTask - Should create and return new task")
    void createTask_ShouldReturnCreatedTask() {
        // Arrange
        TaskRequest request = TaskRequest.builder()
                .title("New Task")
                .description("New description")
                .priority(Priority.HIGH)
                .build();

        Task savedTask = Task.builder()
                .id(1L)
                .title("New Task")
                .description("New description")
                .status(TaskStatus.TODO)
                .priority(Priority.HIGH)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(taskRepository.save(any(Task.class))).thenReturn(savedTask);

        // Act
        TaskResponse response = taskService.createTask(request);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getTitle()).isEqualTo("New Task");
        assertThat(response.getPriority()).isEqualTo(Priority.HIGH);
        assertThat(response.getStatus()).isEqualTo(TaskStatus.TODO);

        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    @DisplayName("createTask - Should use default values when not provided")
    void createTask_ShouldUseDefaults_WhenNotProvided() {
        // Arrange
        TaskRequest request = TaskRequest.builder()
                .title("Minimal Task")
                .build();

        Task savedTask = Task.builder()
                .id(1L)
                .title("Minimal Task")
                .status(TaskStatus.TODO)
                .priority(Priority.MEDIUM)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(taskRepository.save(any(Task.class))).thenReturn(savedTask);

        // Act
        TaskResponse response = taskService.createTask(request);

        // Assert
        assertThat(response.getStatus()).isEqualTo(TaskStatus.TODO);
        assertThat(response.getPriority()).isEqualTo(Priority.MEDIUM);
    }

    @Test
    @DisplayName("getTask - Should return task when found")
    void getTask_ShouldReturnTask_WhenFound() {
        // Arrange
        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));

        // Act
        TaskResponse response = taskService.getTask(1L);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getTitle()).isEqualTo("Test Task");

        verify(taskRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("getTask - Should throw exception when not found")
    void getTask_ShouldThrowException_WhenNotFound() {
        // Arrange
        when(taskRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> taskService.getTask(999L))
                .isInstanceOf(TaskNotFoundException.class)
                .hasMessageContaining("999");

        verify(taskRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("getAllTasks - Should return all tasks")
    void getAllTasks_ShouldReturnAllTasks() {
        // Arrange
        Task task2 = Task.builder()
                .id(2L)
                .title("Task 2")
                .status(TaskStatus.IN_PROGRESS)
                .priority(Priority.HIGH)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(taskRepository.findAll()).thenReturn(Arrays.asList(sampleTask, task2));

        // Act
        List<TaskResponse> responses = taskService.getAllTasks();

        // Assert
        assertThat(responses).hasSize(2);
        assertThat(responses.get(0).getTitle()).isEqualTo("Test Task");
        assertThat(responses.get(1).getTitle()).isEqualTo("Task 2");

        verify(taskRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("updateTask - Should update and return task")
    void updateTask_ShouldReturnUpdatedTask() {
        // Arrange
        TaskRequest request = TaskRequest.builder()
                .title("Updated Title")
                .description("Updated description")
                .status(TaskStatus.DONE)
                .priority(Priority.LOW)
                .build();

        Task updatedTask = Task.builder()
                .id(1L)
                .title("Updated Title")
                .description("Updated description")
                .status(TaskStatus.DONE)
                .priority(Priority.LOW)
                .createdAt(sampleTask.getCreatedAt())
                .updatedAt(LocalDateTime.now())
                .build();

        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));
        when(taskRepository.save(any(Task.class))).thenReturn(updatedTask);

        // Act
        TaskResponse response = taskService.updateTask(1L, request);

        // Assert
        assertThat(response.getTitle()).isEqualTo("Updated Title");
        assertThat(response.getStatus()).isEqualTo(TaskStatus.DONE);
        assertThat(response.getPriority()).isEqualTo(Priority.LOW);

        verify(taskRepository, times(1)).findById(1L);
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    @DisplayName("updateTask - Should throw exception when not found")
    void updateTask_ShouldThrowException_WhenNotFound() {
        // Arrange
        TaskRequest request = TaskRequest.builder()
                .title("Updated Title")
                .build();

        when(taskRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> taskService.updateTask(999L, request))
                .isInstanceOf(TaskNotFoundException.class);

        verify(taskRepository, never()).save(any());
    }

    @Test
    @DisplayName("deleteTask - Should delete task when found")
    void deleteTask_ShouldDeleteTask_WhenFound() {
        // Arrange
        when(taskRepository.existsById(1L)).thenReturn(true);
        doNothing().when(taskRepository).deleteById(1L);

        // Act
        taskService.deleteTask(1L);

        // Assert
        verify(taskRepository, times(1)).existsById(1L);
        verify(taskRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("deleteTask - Should throw exception when not found")
    void deleteTask_ShouldThrowException_WhenNotFound() {
        // Arrange
        when(taskRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> taskService.deleteTask(999L))
                .isInstanceOf(TaskNotFoundException.class);

        verify(taskRepository, never()).deleteById(any());
    }
}
