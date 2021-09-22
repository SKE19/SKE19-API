# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - Unreleased
### Added
- JsonWebToken for API authentication *(planned)*
- AWS SDK is now used for DynamoDB.

### Changed
- Environment has added three new variables including, `SECRET_IDENTIFER`, `AWS_ACCESS_KEY` and `AWS_SECRET_ACCESS_KEY`.
- [Production API](https://ske19-api.herokuapp.com/) access now requires authorization. 

## [1.0.0] - 2021-09-20
### Added
- Basic Express (RESTful) API schema. Now, includes only GET routes.
- Wiki containing all available routes.