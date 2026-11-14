package user

import (
	"errors"
	"template/helper"
)

type UserService interface {
	FindAll() ([]User, error)
	Create(userRequest UserRequest) (*User, error)
	GetByID(id int) (*User, error)
	GetByEmail(email string) (*User, error)
	Update(id int, userRequest UserRequest) (*User, error)
	Delete(id int) error
}

type userService struct {
	repo UserRepository
}

func NewUserService(repo UserRepository) UserService {
	return &userService{repo: repo}
}

func (s *userService) FindAll() ([]User, error) {
	users, err := s.repo.FindAll()
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (s *userService) Create(userRequest UserRequest) (*User, error) {

	existingUser, _ := s.repo.GetByEmail(userRequest.Email)
	if existingUser != nil {
		return nil, errors.New("email already exists")
	}

	hashedPassword, err := helper.HashPassword(userRequest.Password)
	if err != nil {
		return nil, err
	}
	user := User{
		Username: userRequest.Username,
		Email:    userRequest.Email,
		Password: hashedPassword, // Password is now hashed
	}

	if err := s.repo.Create(&user); err != nil {
		return nil, err
	}
	return &user, nil
}
func (s *userService) GetByID(id int) (*User, error) {
	user, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}
	return user, nil
}
func (s *userService) GetByEmail(email string) (*User, error) {
	user, err := s.repo.GetByEmail(email)
	if err != nil {
		return nil, err
	}
	return user, nil
}
func (s *userService) Update(id int, userRequest UserRequest) (*User, error) {
	user, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	if userRequest.Username != "" {
		user.Username = userRequest.Username
	}
	if userRequest.Email != "" {
		user.Email = userRequest.Email
	}
	if userRequest.Password != "" {
		hashedPassword, err := helper.HashPassword(userRequest.Password)
		if err != nil {
			return nil, err
		}
		user.Password = hashedPassword // Update with hashed password
	}

	if err := s.repo.Update(user); err != nil {
		return nil, err
	}
	return user, nil
}
func (s *userService) Delete(id int) error {
	if err := s.repo.Delete(id); err != nil {
		return err
	}
	return nil
}
