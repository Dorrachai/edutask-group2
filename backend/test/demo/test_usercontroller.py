
import re
import pytest
from unittest.mock import Mock
from src.controllers.usercontroller import UserController
from src.util.dao import DAO

# Prepare mock DAO
mock_dao = Mock(spec=DAO)
uc = UserController(dao=mock_dao)

emailValidator = re.compile('.*@.*')

# TC01: Test if email of existing user is valid
@pytest.mark.unit
def test_valid_email_existing_user():
    email = 'test@example.com'
    mock_dao.find.return_value = [{'email': email, 'name': 'Test User'}]

    result = uc.get_user_by_email(email)
    assert result == {'email': email, 'name': 'Test User'}

# TC02:Test valid email of a non-existing user
@pytest.mark.unit
def test_valid_email_non_existing_user():
    email = 'non_existing@example.com'
    mock_dao.find.return_value = []

    result = uc.get_user_by_email(email)
    assert result is None

# TC:03 Test case for an invalid email format
@pytest.mark.unit
def test_invalid_email_format():
    email = 'invalid_email_format'

    with pytest.raises(ValueError):
        uc.get_user_by_email(email)

# TC:04 Test case for an empty email string
@pytest.mark.unit
def test_empty_email():
    email = ''

    with pytest.raises(ValueError):
        uc.get_user_by_email(email)

# TC05: Test case for a non-string email input
@pytest.mark.unit
def test_non_string_email_input():
    email = 123

    with pytest.raises(ValueError):
        uc.get_user_by_email(email)

# TC06: Test case for when the database is unavailable
@pytest.mark.unit
def test_database_unavailable():
    email = 'test@example.com'
    mock_dao.find.side_effect = Exception("Database operation failed")

    with pytest.raises(Exception):
        uc.get_user_by_email(email)

    mock_dao.find.side_effect = None

# TC07: Test case for duplicate email addresses in the database
@pytest.mark.unit
def test_duplicate_email_addresses():
    email = 'test@example.com'
    mock_dao.find.return_value = [
        {'email': email, 'name': 'Test User'},
        {'email': email, 'name': 'Test User 2'},
    ]

    result = uc.get_user_by_email(email)
    assert result == {'email': email, 'name': 'Test User'}


# TC08: Test case for Monkey/Ad-hoc with random string as email
@pytest.mark.unit
def test_random_string_email():
    email = 'randomstring'

    with pytest.raises(ValueError):
        uc.get_user_by_email(email)

# TC10: Test case for Boundary Value Analysis with smallest valid email
@pytest.mark.unit
def test_smallest_valid_email():
    # Smallest possible valid email according to standard email format
    email = 'a@b.co'
    mock_dao.find.return_value = [{'email': email, 'name': 'Test User'}]

    result = uc.get_user_by_email(email)
    assert result == {'email': email, 'name': 'Test User'}

# TC09: Test case for Boundary Value Analysis with a very large email
@pytest.mark.unit
def test_very_large_valid_email():
    # Construct a very large but technically valid email
    email = 'a' * 64 + '@' + 'b' * 63 + '.com'
    
    # Assume that such a large email is not expected to be in the system
    mock_dao.find.return_value = []

    result = uc.get_user_by_email(email)
    assert result is None


# TC08: Test case for Boundary Value Analysis with no '@' in the email
@pytest.mark.unit
def test_no_at():
    email = 'no_at_example.com'
    with pytest.raises(ValueError):
        uc.get_user_by_email(email)
