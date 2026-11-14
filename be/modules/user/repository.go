package user

import "gorm.io/gorm"

type UserRepository interface {
	FindAll() ([]User, error)
	Create(user *User) error
	GetByID(id int) (*User, error)
	GetByEmail(email string) (*User, error)
	Update(user *User) error
	Delete(id int) error
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) FindAll() ([]User, error) {
	if r.db == nil {
		return []User{}, nil
	}
	var users []User
	err := r.db.Order("id desc").Find(&users).Error
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (r *userRepository) Create(user *User) error {
	if r.db == nil {
		return nil
	}
	if err := r.db.Create(user).Error; err != nil {
		return err
	}
	return nil
}
func (r *userRepository) GetByID(id int) (*User, error) {
	if r.db == nil {
		return nil, gorm.ErrRecordNotFound
	}
	var user User
	if err := r.db.First(&user, id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}
func (r *userRepository) GetByEmail(email string) (*User, error) {
	if r.db == nil {
		return nil, gorm.ErrRecordNotFound
	}
	var user User
	if err := r.db.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}
func (r *userRepository) Update(user *User) error {
	if r.db == nil {
		return nil
	}
	if err := r.db.Save(user).Error; err != nil {
		return err
	}
	return nil
}
func (r *userRepository) Delete(id int) error {
	if r.db == nil {
		return nil
	}
	if err := r.db.Delete(&User{}, id).Error; err != nil {
		return err
	}
	return nil
}
