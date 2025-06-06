package com.example.taskManager.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserDetailsDTO {
	private String id;
	private String firstName;
	private String lastName;
	private String email;
}
