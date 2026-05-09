from django.contrib.auth.models import User
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import serializers, viewsets, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    is_staff = serializers.BooleanField(required=False, default=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_staff']

    def create(self, validated_data):
        is_staff = validated_data.pop('is_staff', False)

        password = validated_data.pop('password', None)
        if not password:
            raise serializers.ValidationError({
                'password': 'Password is required.'
            })

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

        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)

        if 'is_staff' in validated_data:
            instance.is_staff = validated_data.get('is_staff')

        if password:
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

        if len(new_password) < 6:
            return Response(
                {'error': 'Password must be at least 6 characters long.'},
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

        if not old_password or not new_password:
            return Response(
                {'error': 'Old password and new password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(old_password):
            return Response(
                {'error': 'Old password is incorrect.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(new_password) < 6:
            return Response(
                {'error': 'New password must be at least 6 characters long.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {'message': 'Password changed successfully.'},
            status=status.HTTP_200_OK
        )