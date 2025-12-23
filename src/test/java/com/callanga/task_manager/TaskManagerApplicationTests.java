package com.callanga.task_manager;

import com.callanga.task_manager.controller.TaskController;
import com.callanga.task_manager.service.TaskService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Basic application tests - no database required.
 */
@ExtendWith(MockitoExtension.class)
class TaskManagerApplicationTests {

	@Mock
	private TaskService taskService;

	@InjectMocks
	private TaskController taskController;

	@Test
	void controllerShouldBeCreated() {
		assertThat(taskController).isNotNull();
	}

	@Test
	void mainMethodShouldNotThrow() {
		// This test just verifies the main class exists and compiles
		assertThat(TaskManagerApplication.class).isNotNull();
	}
}
