from backend.server import create_app

app = create_app(include_unprefixed_api=True)
