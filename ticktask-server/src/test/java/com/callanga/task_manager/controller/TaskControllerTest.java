package com.callanga.task_manager.controller;

import com.callanga.task_manager.dto.TaskRequest;
import com.callanga.task_manager.dto.TaskResponse;
import com.callanga.task_manager.entity.Priority;
import com.callanga.task_manager.entity.TaskStatus;
import com.callanga.task_manager.exception.GlobalExceptionHandler;
import com.callanga.task_manager.exception.TaskNotFoundException;
import com.callanga.task_manager.service.TaskService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for TaskController.
 * Uses MockMvc with mocked service layer - no database required.
 */
@ExtendWith(MockitoExtension.class)
class TaskControllerTest {

        private MockMvc mockMvc;

        @Mock
        private TaskService taskService;

        @InjectMocks
        private TaskController taskController;

        private ObjectMapper objectMapper;

        @BeforeEach
        void setUp() {
                mockMvc = MockMvcBuilders.standaloneSetup(taskController)
                                .setControllerAdvice(new GlobalExceptionHandler())
                                .build();
                objectMapper = new ObjectMapper();
                objectMapper.registerModule(new JavaTimeModule());
        }

        private TaskResponse createSampleTaskResponse(Long id, String title) {
                return TaskResponse.builder()
                                .id(id)
                                .title(title)
                                .description("Test description")
                                .status(TaskStatus.TODO)
                                .priority(Priority.MEDIUM)
                                .dueDate(LocalDate.now().plusDays(7))
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build();
        }

        @Test
        @DisplayName("POST /api/tasks - Should create a new task")
        void createTask_ShouldReturnCreatedTask() throws Exception {
                // Arrange
                TaskRequest request = TaskRequest.builder()
                                .title("Test Task")
                                .description("Test description")
                                .priority(Priority.HIGH)
                                .build();

                TaskResponse response = createSampleTaskResponse(1L, "Test Task");

                when(taskService.createTask(any(TaskRequest.class))).thenReturn(response);

                // Act & Assert
                mockMvc.perform(post("/api/tasks")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.id", is(1)))
                                .andExpect(jsonPath("$.title", is("Test Task")));

                verify(taskService, times(1)).createTask(any(TaskRequest.class));
        }

        @Test
        @DisplayName("POST /api/tasks - Should return 400 when title is blank")
        void createTask_ShouldReturnBadRequest_WhenTitleIsBlank() throws Exception {
                // Arrange
                TaskRequest request = TaskRequest.builder()
                                .title("")
                                .description("Test description")
                                .build();

                // Act & Assert
                mockMvc.perform(post("/api/tasks")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isBadRequest());

                verify(taskService, never()).createTask(any());
        }

        @Test
        @DisplayName("GET /api/tasks - Should return all tasks")
        void getAllTasks_ShouldReturnListOfTasks() throws Exception {
                // Arrange
                List<TaskResponse> tasks = Arrays.asList(
                                createSampleTaskResponse(1L, "Task 1"),
                                createSampleTaskResponse(2L, "Task 2"));

                when(taskService.getAllTasks()).thenReturn(tasks);

                // Act & Assert
                mockMvc.perform(get("/api/tasks"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$", hasSize(2)))
                                .andExpect(jsonPath("$[0].title", is("Task 1")))
                                .andExpect(jsonPath("$[1].title", is("Task 2")));

                verify(taskService, times(1)).getAllTasks();
        }

        @Test
        @DisplayName("GET /api/tasks/{id} - Should return task by ID")
        void getTask_ShouldReturnTask() throws Exception {
                // Arrange
                TaskResponse response = createSampleTaskResponse(1L, "Test Task");

                when(taskService.getTask(1L)).thenReturn(response);

                // Act & Assert
                mockMvc.perform(get("/api/tasks/1"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id", is(1)))
                                .andExpect(jsonPath("$.title", is("Test Task")));

                verify(taskService, times(1)).getTask(1L);
        }

        @Test
        @DisplayName("GET /api/tasks/{id} - Should return 404 when task not found")
        void getTask_ShouldReturnNotFound_WhenTaskDoesNotExist() throws Exception {
                // Arrange
                when(taskService.getTask(999L)).thenThrow(new TaskNotFoundException(999L));

                // Act & Assert
                mockMvc.perform(get("/api/tasks/999"))
                                .andExpect(status().isNotFound())
                                .andExpect(jsonPath("$.message", containsString("999")));

                verify(taskService, times(1)).getTask(999L);
        }

        @Test
        @DisplayName("PUT /api/tasks/{id} - Should update existing task")
        void updateTask_ShouldReturnUpdatedTask() throws Exception {
                // Arrange
                TaskRequest request = TaskRequest.builder()
                                .title("Updated Task")
                                .description("Updated description")
                                .status(TaskStatus.IN_PROGRESS)
                                .priority(Priority.HIGH)
                                .build();

                TaskResponse response = TaskResponse.builder()
                                .id(1L)
                                .title("Updated Task")
                                .description("Updated description")
                                .status(TaskStatus.IN_PROGRESS)
                                .priority(Priority.HIGH)
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build();

                when(taskService.updateTask(eq(1L), any(TaskRequest.class))).thenReturn(response);

                // Act & Assert
                mockMvc.perform(put("/api/tasks/1")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.title", is("Updated Task")))
                                .andExpect(jsonPath("$.status", is("IN_PROGRESS")));

                verify(taskService, times(1)).updateTask(eq(1L), any(TaskRequest.class));
        }

        @Test
        @DisplayName("DELETE /api/tasks/{id} - Should delete task")
        void deleteTask_ShouldReturnNoContent() throws Exception {
                // Arrange
                doNothing().when(taskService).deleteTask(1L);

                // Act & Assert
                mockMvc.perform(delete("/api/tasks/1"))
                                .andExpect(status().isNoContent());

                verify(taskService, times(1)).deleteTask(1L);
        }

        @Test
        @DisplayName("DELETE /api/tasks/{id} - Should return 404 when task not found")
        void deleteTask_ShouldReturnNotFound_WhenTaskDoesNotExist() throws Exception {
                // Arrange
                doThrow(new TaskNotFoundException(999L)).when(taskService).deleteTask(999L);

                // Act & Assert
                mockMvc.perform(delete("/api/tasks/999"))
                                .andExpect(status().isNotFound());

                verify(taskService, times(1)).deleteTask(999L);
        }
}
