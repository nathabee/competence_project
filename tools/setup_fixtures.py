from django.contrib.auth.models import User
from game.models import Player, Game

def create_initial_data():
    # User data
    user_data = [
        {"username": "dave", "email": "dave@example.com"},
        {"username": "eve", "email": "eve@example.com"},
        {"username": "frank", "email": "frank@example.com"},
        {"username": "grace", "email": "grace@example.com"},
        {"username": "henry", "email": "henry@example.com"},
        {"username": "ivy", "email": "ivy@example.com"},
    ]

    # Create users
    for index, user_info in enumerate(user_data, start=5):
        user, created = User.objects.get_or_create(
            pk=index,
            defaults={
                "username": user_info["username"],
                "email": user_info["email"],
                "is_staff": False,
                "is_active": True,
            }
        )
        if created:
            user.set_password("your_password")  # Set a password
            user.save()

        # Create player
        player, created = Player.objects.get_or_create(
            user=user,
            defaults={"score": index * 1000}
        )

        # Create game for each player
        Game.objects.create(
            player=player,
            rocket_position_x=index * 50,
            rocket_position_y=index * 100,
            asteroids=[]
        )

if __name__ == "__main__":
    create_initial_data()
