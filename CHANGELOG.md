# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.1] - 2025-10-18

### Added
- Initial implementation of MutexPool class
- Support for concurrent job processing with configurable pool size
- `start(job)` method to add jobs to the pool
- `allJobsFinished()` method to wait for all jobs to complete
- `getSemaphoreValue()` method to check available slots
- TypeScript type definitions
- Jest test suite
- Comprehensive documentation in English and Russian
- GitHub Actions CI/CD workflows
- MIT License

### Features
- Control concurrent task execution with configurable pool size
- Simple async/await based API
- TypeScript support out of the box
- Lightweight implementation based on async-mutex

[Unreleased]: https://github.com/VitalyOstanin/mutex-pool/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/VitalyOstanin/mutex-pool/releases/tag/v0.0.1
