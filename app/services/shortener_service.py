from sqlalchemy.orm import Session


from app.models.short_url import ShortURL
from app.schemas.short_url import URLCreate
from app.utils import generate_short_code, is_valid_custom_alias


def get_url_by_short_code(db: Session, short_code: str):
    return db.query(ShortURL).filter(ShortURL.short_code == short_code).first()


def generate_unique_short_code(db: Session) -> str:
    short_code = generate_short_code()

    while get_url_by_short_code(db, short_code):
        short_code = generate_short_code()

    return short_code


def create_short_url(db: Session, url_data: URLCreate):
    if url_data.custom_alias:
        short_code = url_data.custom_alias

        if not is_valid_custom_alias(short_code):
            raise ValueError(
                "Custom alias can only contain letters, numbers, underscores, and hyphens"
            )

        if get_url_by_short_code(db, short_code):
            return None
    else:
        short_code = generate_unique_short_code(db)

    db_url = ShortURL(original_url=str(url_data.original_url), short_code=short_code)

    db.add(db_url)
    db.commit()
    db.refresh(db_url)

    return db_url


def increment_click_count(db: Session, db_url: ShortURL):
    db_url.clicks += 1
    db.commit()
    db.refresh(db_url)
