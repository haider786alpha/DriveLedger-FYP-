from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import serializers, viewsets, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

def get_password_errors(password, user=None, username="", email=""):
    errors = []

    if not password:
        errors.append("Password is required.")
        return errors

    if len(password) < 8:
        errors.append("Password must be at least 8 characters long.")

    password_lower = password.lower()
    username = (username or "").strip().lower()
    email = (email or "").strip().lower()
    email_name = email.split("@")[0] if "@" in email else email

    if username and username in password_lower:
        errors.append("Password must not contain the username.")

    if email_name and email_name in password_lower:
        errors.append("Password must not contain the email name.")

    try:
        validate_password(password, user=user)
    except DjangoValidationError as exc:
        errors.extend(exc.messages)

    return list(dict.fromkeys(errors))


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)
    is_staff = serializers.BooleanField(required=False, default=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'confirm_password', 'is_staff']

    def validate_username(self, value):
        username = (value or "").strip()

        if not username:
            raise serializers.ValidationError("Username is required.")

        if len(username) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters long.")

        qs = User.objects.filter(username__iexact=username)

        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError("This username is already taken.")

        return username

    def validate_email(self, value):
        email = (value or "").strip().lower()

        if not email:
            return email

        qs = User.objects.filter(email__iexact=email)

        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError("This email is already registered.")

        return email

    def validate(self, attrs):
        password = attrs.get("password")
        confirm_password = attrs.get("confirm_password")

        username = attrs.get("username") or getattr(self.instance, "username", "")
        email = attrs.get("email") or getattr(self.instance, "email", "")

        if self.instance is None:
            if not password:
                raise serializers.ValidationError({
                    "password": "Password is required."
                })

            if not confirm_password:
                raise serializers.ValidationError({
                    "confirm_password": "Confirm password is required."
                })

            if password != confirm_password:
                raise serializers.ValidationError({
                    "confirm_password": "Password and confirm password do not match."
                })

            password_errors = get_password_errors(
                password=password,
                username=username,
                email=email
            )

            if password_errors:
                raise serializers.ValidationError({
                    "password": password_errors
                })

        return attrs

    def create(self, validated_data):
        is_staff = validated_data.pop('is_staff', False)
        password = validated_data.pop('password', None)
        validated_data.pop('confirm_password', None)

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=password
        )

        user.is_staff = is_staff
        user.save(update_fields=['is_staff'])

        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        validated_data.pop('confirm_password', None)

        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)

        if 'is_staff' in validated_data:
            instance.is_staff = validated_data.get('is_staff')

        if password:
            password_errors = get_password_errors(
                password=password,
                user=instance,
                username=instance.username,
                email=instance.email
            )

            if password_errors:
                raise serializers.ValidationError({
                    "password": password_errors
                })

            instance.set_password(password)

        instance.save()
        return instance

@extend_schema_view(
    list=extend_schema(
        tags=["users"],
        summary="List all users",
        description="Returns all system users including admin users and driver login users."
    ),
    retrieve=extend_schema(
        tags=["users"],
        summary="Retrieve a single user",
        description="Returns details of a specific user by ID."
    ),
    create=extend_schema(
        tags=["users"],
        summary="Create a new user",
        description="Creates a new user account. Set is_staff=true for admin users and false for driver users."
    ),
    update=extend_schema(
        tags=["users"],
        summary="Update a user",
        description="Fully updates a user account including username, email and user role."
    ),
    partial_update=extend_schema(
        tags=["users"],
        summary="Partially update a user",
        description="Partially updates user fields such as username, email or user role."
    ),
    destroy=extend_schema(
        tags=["users"],
        summary="Delete a user",
        description="Deletes a user account from the system."
    ),
)
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @extend_schema(
        tags=["users"],
        summary="Reset user password",
        description="Allows admin to reset a user's password by providing new_password and confirm_password."
    )
    @action(detail=True, methods=['post'], url_path='reset-password')
    def reset_password(self, request, pk=None):
        user = self.get_object()

        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if not new_password or not confirm_password:
            return Response(
                {'error': 'New password and confirm password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_password != confirm_password:
            return Response(
                {'error': 'Passwords do not match.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if user.check_password(new_password):
         return Response(
        {'error': 'New password cannot be the same as the old password.'},
        status=status.HTTP_400_BAD_REQUEST
    )

        password_errors = get_password_errors(
          password=new_password,
          user=user,
          username=user.username,
          email=user.email
)

        if password_errors:
         return Response(
        {'error': " ".join(password_errors)},
        status=status.HTTP_400_BAD_REQUEST
    )

        user.set_password(new_password)
        user.save()

        return Response(
            {'message': 'Password reset successfully.'},
            status=status.HTTP_200_OK
        )


@extend_schema(
    tags=["users"],
    summary="Change logged-in user password",
    description="Allows the logged-in user to change password using old_password and new_password."
)
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if not old_password or not new_password or not confirm_password:
         return Response(
        {'error': 'Old password, new password and confirm password are required.'},
        status=status.HTTP_400_BAD_REQUEST
    )

        if not user.check_password(old_password):
            return Response(
                {'error': 'Old password is incorrect.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_password != confirm_password:
         return Response(
        {'error': 'New password and confirm password do not match.'},
        status=status.HTTP_400_BAD_REQUEST
    )

        if user.check_password(new_password):
         return Response(
        {'error': 'New password cannot be the same as the old password.'},
        status=status.HTTP_400_BAD_REQUEST
    )

        password_errors = get_password_errors(
        password=new_password,
        user=user,
        username=user.username,
        email=user.email
)

        if password_errors:
         return Response(
        {'error': " ".join(password_errors)},
        status=status.HTTP_400_BAD_REQUEST
    )

        user.set_password(new_password)
        user.save()

        return Response(
            {'message': 'Password changed successfully.'},
            status=status.HTTP_200_OK
        )