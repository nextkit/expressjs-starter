Feature: UserController "/api/users"
  Test the functionality of the UserController

  Scenario: Fails to register the user because of invalid email
    When requesting "/api/users/register" with the method "POST"
    And request body
      """
      {
        "username": "Mike",
        "email": "mikeexample.com",
        "password": "validPassword"
      }
      """
    Then response has status "400"
    And response body property "errors" is of type "Array"

  Scenario: Register/Create a new user
    When requesting "/api/users/register" with the method "POST"
    And request body
      """
      {
        "username": "Mike",
        "email": "mike@example.com",
        "password": "validPassword"
      }
      """
    Then response has status "201"
    And response body property "token" is of type "String"

  Scenario: Fails to login because of invalid password
    When requesting "/api/users/login" with the method "POST"
    And request body
      """
      {
        "email": "mike@example.com",
        "password": "notValidPassword"
      }
      """
    Then response has status "400"

  Scenario: The user logs in
    When requesting "/api/users/login" with the method "POST"
    And request body
      """
      {
        "email": "mike@example.com",
        "password": "validPassword"
      }
      """
    Then response has status "200"
    And response body property "token" is of type "String"

  Scenario: Fails to update the password because invalid password
    Given "email" "mike@example.com" is logged in with the password "validPassword"
    When requesting "/api/users" with the method "PATCH"
    And request body
      """
      {
        "newPassword": "testtest123",
        "password": "invalidPassword"
      }
      """
    Then response has status "400"

  Scenario: Updates the users password
    Given "email" "mike@example.com" is logged in with the password "validPassword"
    When requesting "/api/users" with the method "PATCH"
    And request body
      """
      {
        "newPassword": "testtest123",
        "password": "validPassword"
      }
      """
    Then response has status "200"

  Scenario: Fails to delete the user account because of invalid password
    Given "email" "mike@example.com" is logged in with the password "testtest123"
    When requesting "/api/users" with the method "DELETE"
    And request body
      """
      {
        "password": "invalidPassword"
      }
      """
    Then response has status "400"

  Scenario: Delete the users account
    Given "email" "mike@example.com" is logged in with the password "testtest123"
    When requesting "/api/users" with the method "DELETE"
    And request body
      """
      {
        "password": "testtest123"
      }
      """
    Then response has status "200"
