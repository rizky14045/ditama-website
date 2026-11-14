package user

import (
	"net/http"
	"strconv"
	"template/helper"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type UserHandler struct {
	service UserService
}

func NewUserHandler(service UserService) *UserHandler {
	return &UserHandler{service: service}
}

func (h *UserHandler) Index(context *gin.Context) {
	users, err := h.service.FindAll()
	if err != nil {
		helper.JsonResponse(
			context,
			false,
			"Failed to retrieve users",
			nil,
			err,
			http.StatusInternalServerError)
		return
	}
	helper.JsonResponse(
		context,
		true,
		"Users retrieved successfully",
		users,
		nil,
		http.StatusOK)
}

func (h *UserHandler) Show(context *gin.Context) {
	idParam := context.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		helper.JsonResponse(
			context,
			false,
			"Invalid user ID",
			nil,
			err,
			http.StatusBadRequest)
		return
	}
	user, err := h.service.GetByID(id)
	if err != nil {
		helper.JsonResponse(
			context,
			false,
			"User not found",
			nil,
			nil,
			http.StatusNotFound)
		return
	}
	helper.JsonResponse(
		context,
		true,
		"User retrieved successfully",
		user,
		nil,
		http.StatusOK)
}

func (h *UserHandler) Create(context *gin.Context) {
	var request UserRequest
	err := context.ShouldBindJSON(&request)
	if err != nil {
		var errorMessages []helper.Error
		if validationErrors, ok := err.(validator.ValidationErrors); ok {
			for _, e := range validationErrors {
				errorMessages = append(errorMessages, helper.Error{
					Field:   e.Field(),
					Message: helper.ValidationMessage(e),
				})
			}
		} else {
			errorMessages = append(errorMessages, helper.Error{
				Field:   "",
				Message: err.Error(),
			})
		}
		helper.JsonResponse(
			context,
			false,
			"Validation failed",
			nil,
			errorMessages,
			http.StatusBadRequest,
		)
		return
	}

	user, err := h.service.Create(request)
	if err != nil {
		helper.JsonResponse(
			context,
			false,
			err.Error(),
			nil,
			nil,
			http.StatusInternalServerError)
		return
	}

	helper.JsonResponse(
		context,
		true,
		"User created successfully",
		user,
		nil,
		http.StatusCreated)
}

func (h *UserHandler) Update(context *gin.Context) {
	idParam := context.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		helper.JsonResponse(
			context,
			false,
			"Invalid user ID",
			nil,
			err,
			http.StatusBadRequest)
		return
	}
	var request UserRequest
	err = context.ShouldBindJSON(&request)
	if err != nil {
		var errorMessages []helper.Error
		if validationErrors, ok := err.(validator.ValidationErrors); ok {
			for _, e := range validationErrors {
				errorMessages = append(errorMessages, helper.Error{
					Field:   e.Field(),
					Message: helper.ValidationMessage(e),
				})
			}
		} else {
			errorMessages = append(errorMessages, helper.Error{
				Field:   "",
				Message: err.Error(),
			})
		}
		helper.JsonResponse(
			context,
			false,
			"Validation failed",
			nil,
			errorMessages,
			http.StatusBadRequest,
		)
		return
	}
	user, err := h.service.Update(id, request)
	if err != nil {
		helper.JsonResponse(
			context,
			false,
			err.Error(),
			nil,
			nil,
			http.StatusInternalServerError)
		return
	}
	helper.JsonResponse(
		context,
		true,
		"User updated successfully",
		user,
		nil,
		http.StatusOK)
}

func (h *UserHandler) Destroy(context *gin.Context) {
	idParam := context.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		helper.JsonResponse(
			context,
			false,
			"Invalid user ID",
			nil,
			err,
			http.StatusBadRequest)
		return
	}
	err = h.service.Delete(id)
	if err != nil {
		helper.JsonResponse(
			context,
			false,
			err.Error(),
			nil,
			nil,
			http.StatusInternalServerError)
		return
	}
	helper.JsonResponse(
		context,
		true,
		"User deleted successfully",
		nil,
		nil,
		http.StatusOK)
}
