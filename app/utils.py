import random
import string
import re

ALIAS_REGEX = r"^[a-zA-Z0-9_-]+$"


def generate_short_code(length: int = 6) -> str:
    characters = string.ascii_letters + string.digits
    return "".join(random.choices(characters, k=length))


def is_valid_custom_alias(alias: str) -> bool:
    return bool(re.fullmatch(ALIAS_REGEX, alias))
