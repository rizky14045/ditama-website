package auth

import (
	"template/models"
)

type AuthService interface {
	FindByEmail(email string) (*models.User, error)
	JwtToken(user *models.User) (string, error)
	UpdateLastLogin(id string) error
}

type authService struct {
	repo AuthRepository
}

func NewAuthService(repo AuthRepository) AuthService {
	return &authService{repo: repo}
}

func (s *authService) FindByEmail(email string) (*models.User, error) {
	return s.repo.FindByEmail(email)
}

func (s *authService) JwtToken(user *models.User) (string, error) {
	return s.repo.JwtToken(user)
}

func (s *authService) UpdateLastLogin(id string) error {
	return s.repo.UpdateLastLogin(id)
}
