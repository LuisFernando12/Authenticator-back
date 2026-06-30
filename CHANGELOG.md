# [2.1.0-beta.1](https://github.com/LuisFernando12/Authenticator/compare/v2.0.0...v2.1.0-beta.1) (2026-06-30)


### Bug Fixes

* **config:** update docker-compose service dependencies and template path ([078f9ce](https://github.com/LuisFernando12/Authenticator/commit/078f9ce3e96c14e97f752bc97bf556c5869e1ab9))
* **email:** add error logging in sendActivationEmail method ([0677dfd](https://github.com/LuisFernando12/Authenticator/commit/0677dfd86f154ea6805301ae996f754a0329e44c))


### Features

* **consent:** add scopes property to OauthConsent and related services ([bd93c53](https://github.com/LuisFernando12/Authenticator/commit/bd93c53a2315410ba9831ce113ed93140ff63260))
* **env:** add PORT variable and update database host configuration ([6ed1ce8](https://github.com/LuisFernando12/Authenticator/commit/6ed1ce80be2eeba63037d6b67ce76d9cf5bbc456))
* **token and session:** enhance token entity and repository for token family management ([9de698b](https://github.com/LuisFernando12/Authenticator/commit/9de698b88e87f73e453b8f80f7e23b6a369a46a4))

# [2.0.0-beta.6](https://github.com/LuisFernando12/Authenticator/compare/v2.0.0-beta.5...v2.0.0-beta.6) (2026-06-14)

### Features

- **consent:** add scopes property to OauthConsent and related services ([bd93c53](https://github.com/LuisFernando12/Authenticator/commit/bd93c53a2315410ba9831ce113ed93140ff63260))

# [2.0.0-beta.5](https://github.com/LuisFernando12/Authenticator/compare/v2.0.0-beta.4...v2.0.0-beta.5) (2026-06-14)

### Bug Fixes

- **email:** add error logging in sendActivationEmail method ([0677dfd](https://github.com/LuisFernando12/Authenticator/commit/0677dfd86f154ea6805301ae996f754a0329e44c))

# [2.0.0-beta.4](https://github.com/LuisFernando12/Authenticator/compare/v2.0.0-beta.3...v2.0.0-beta.4) (2026-06-13)

### Bug Fixes

- **config:** update docker-compose service dependencies and template path ([078f9ce](https://github.com/LuisFernando12/Authenticator/commit/078f9ce3e96c14e97f752bc97bf556c5869e1ab9))

# [2.0.0-beta.3](https://github.com/LuisFernando12/Authenticator/compare/v2.0.0-beta.2...v2.0.0-beta.3) (2026-06-10)

### Bug Fixes

- **tests:** correct typos in variable names and improve response handling in Oauth E2E tests ([ca4de04](https://github.com/LuisFernando12/Authenticator/commit/ca4de04c33e782f649b18412a13551938003841d))

# [2.0.0-beta.2](https://github.com/LuisFernando12/Authenticator/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2026-06-09)

### Bug Fixes

- **docs:** correct spelling of 'refresh-token' in API documentation ([4e4bcc8](https://github.com/LuisFernando12/Authenticator/commit/4e4bcc8bcc1621fa67ae6709834882e5e28cd915))

# [2.0.0-beta.1](https://github.com/LuisFernando12/Authenticator/compare/v1.5.0...v2.0.0-beta.1) (2026-06-06)

### Bug Fixes

- add escape to status in OauthDomainError ([42fb754](https://github.com/LuisFernando12/Authenticator/commit/42fb754ea0c67b14abec5e57dfd0ad5c7143a8f2))
- **controller:** fix import UserDTO to true path ([8223aeb](https://github.com/LuisFernando12/Authenticator/commit/8223aeb5ac3d0c770ba645bc420ce664fefe947a))
- some adjuts ([77460f5](https://github.com/LuisFernando12/Authenticator/commit/77460f5074fec17be159f9e81feb5b954d4798a8))
- **user:** fixed throw erro on entity ([f3f7d41](https://github.com/LuisFernando12/Authenticator/commit/f3f7d41e382f7019de4e8bbea293cc40122c6ff8))

### Code Refactoring

- **oauth:** adopt domain-driven design architecture ([206884b](https://github.com/LuisFernando12/Authenticator/commit/206884bf9363fafbed6318d33a63a68d08a54f41))

### Features

- **token:** implement token management features ([4cdffb8](https://github.com/LuisFernando12/Authenticator/commit/4cdffb8b1abcd228e86ae4cf648fe0dd2144cc54))

### BREAKING CHANGES

- **oauth:** OauthService is deprecated; migrate to use cases.

# [1.5.0](https://github.com/LuisFernando12/Authenticator/compare/v1.4.0...v1.5.0) (2026-05-08)

### Bug Fixes

- **config:** add updated pnpm-lock file ([e1aabd6](https://github.com/LuisFernando12/Authenticator/commit/e1aabd675449bef37519837fd552f8474eaba05f))
- **config:** move mailer to dependencies ([64acedb](https://github.com/LuisFernando12/Authenticator/commit/64acedb3f4938285966320a080491fcab7a7866c))
- hash client secret using bcrypt on database.setup to fix e2e test ([2ee988d](https://github.com/LuisFernando12/Authenticator/commit/2ee988d311eb32e8dfce6482ec4cfb3e6b4e06b4))
- remove required validation for access token expiration and refresh token days ([578c0d1](https://github.com/LuisFernando12/Authenticator/commit/578c0d1699274426e15f317e710c08bcb4e1bbef))
- update database field names and types for consistency ([6840177](https://github.com/LuisFernando12/Authenticator/commit/6840177ce1aebd5904427767c309ad21e1d244e3))

### Features

- add token expiration configuration ([7396152](https://github.com/LuisFernando12/Authenticator/commit/7396152fc090f657d51c4e73e0aa183746c3c13d))

# [1.5.0-beta.1](https://github.com/LuisFernando12/Authenticator/compare/v1.4.1-beta.2...v1.5.0-beta.1) (2026-05-06)

### Bug Fixes

- remove required validation for access token expiration and refresh token days ([578c0d1](https://github.com/LuisFernando12/Authenticator/commit/578c0d1699274426e15f317e710c08bcb4e1bbef))

### Features

- add token expiration configuration ([7396152](https://github.com/LuisFernando12/Authenticator/commit/7396152fc090f657d51c4e73e0aa183746c3c13d))

## [1.4.1-beta.2](https://github.com/LuisFernando12/Authenticator/compare/v1.4.1-beta.1...v1.4.1-beta.2) (2026-05-06)

### Bug Fixes

- hash client secret using bcrypt on database.setup to fix e2e test ([2ee988d](https://github.com/LuisFernando12/Authenticator/commit/2ee988d311eb32e8dfce6482ec4cfb3e6b4e06b4))

## [1.4.1-beta.1](https://github.com/LuisFernando12/Authenticator/compare/v1.4.0...v1.4.1-beta.1) (2026-05-02)

### Bug Fixes

- **config:** add updated pnpm-lock file ([e1aabd6](https://github.com/LuisFernando12/Authenticator/commit/e1aabd675449bef37519837fd552f8474eaba05f))
- **config:** move mailer to dependencies ([64acedb](https://github.com/LuisFernando12/Authenticator/commit/64acedb3f4938285966320a080491fcab7a7866c))
- update database field names and types for consistency ([6840177](https://github.com/LuisFernando12/Authenticator/commit/6840177ce1aebd5904427767c309ad21e1d244e3))

# [1.4.0](https://github.com/LuisFernando12/Authenticator/compare/v1.3.0...v1.4.0) (2026-04-30)

### Bug Fixes

- update token expiration handling in tests refresh token and revoke token to use dynamic dates ([9602361](https://github.com/LuisFernando12/Authenticator/commit/96023613f3dd4ab772c8e0d73b283ddc49b716ba))

### Features

- add global setup for e2e tests ([48c7768](https://github.com/LuisFernando12/Authenticator/commit/48c7768844687f1ddb9e281a5a14c5541689fba2))

# [1.4.0-beta.3](https://github.com/LuisFernando12/Authenticator/compare/v1.4.0-beta.2...v1.4.0-beta.3) (2026-05-02)

### Bug Fixes

- update database field names and types for consistency ([6840177](https://github.com/LuisFernando12/Authenticator/commit/6840177ce1aebd5904427767c309ad21e1d244e3))

# [1.4.0-beta.2](https://github.com/LuisFernando12/Authenticator/compare/v1.4.0-beta.1...v1.4.0-beta.2) (2026-05-01)

### Bug Fixes

- **config:** add updated pnpm-lock file ([e1aabd6](https://github.com/LuisFernando12/Authenticator/commit/e1aabd675449bef37519837fd552f8474eaba05f))
- **config:** move mailer to dependencies ([64acedb](https://github.com/LuisFernando12/Authenticator/commit/64acedb3f4938285966320a080491fcab7a7866c))

# [1.4.0-beta.1](https://github.com/LuisFernando12/Authenticator/compare/v1.3.1-beta.1...v1.4.0-beta.1) (2026-04-30)

### Features

- add global setup for e2e tests ([48c7768](https://github.com/LuisFernando12/Authenticator/commit/48c7768844687f1ddb9e281a5a14c5541689fba2))

## [1.3.1-beta.1](https://github.com/LuisFernando12/Authenticator/compare/v1.3.0...v1.3.1-beta.1) (2026-04-24)

### Bug Fixes

- update token expiration handling in tests refresh token and revoke token to use dynamic dates ([9602361](https://github.com/LuisFernando12/Authenticator/commit/96023613f3dd4ab772c8e0d73b283ddc49b716ba))

# [1.3.0](https://github.com/LuisFernando12/Authenticator/compare/v1.2.0...v1.3.0) (2026-04-01)

### Features

- enhance password reset flow with improved security and UX ([6086d2f](https://github.com/LuisFernando12/Authenticator/commit/6086d2f0d835e4c8162787efe2253e6ec0082d9a))

# [1.3.0-beta.1](https://github.com/LuisFernando12/Authenticator/compare/v1.2.0...v1.3.0-beta.1) (2026-04-01)

### Features

- enhance password reset flow with improved security and UX ([6086d2f](https://github.com/LuisFernando12/Authenticator/commit/6086d2f0d835e4c8162787efe2253e6ec0082d9a))

# [1.2.0](https://github.com/LuisFernando12/Authenticator/compare/v1.1.1...v1.2.0) (2026-03-30)

### Features

- implement multi-token support and opaque refresh tokens ([9927989](https://github.com/LuisFernando12/Authenticator/commit/992798916fb998aa475509aa9f8f3ed37042b692))

# [1.2.0-beta.1](https://github.com/LuisFernando12/Authenticator/compare/v1.1.1-beta.1...v1.2.0-beta.1) (2026-03-30)

### Features

- implement multi-token support and opaque refresh tokens ([9927989](https://github.com/LuisFernando12/Authenticator/commit/992798916fb998aa475509aa9f8f3ed37042b692))

## [1.1.1](https://github.com/LuisFernando12/Authenticator/compare/v1.1.0...v1.1.1) (2026-03-25)

### Bug Fixes

- **release:** rename realease.config.js to release.config.js ([45e7fa4](https://github.com/LuisFernando12/Authenticator/commit/45e7fa49b7dbbaf841fcdb752c03eb0802fa7c6d))

## [1.1.1-beta.1](https://github.com/LuisFernando12/Authenticator/compare/v1.1.0...v1.1.1-beta.1) (2026-03-25)

### Bug Fixes

- **release:** rename realease.config.js to release.config.js ([45e7fa4](https://github.com/LuisFernando12/Authenticator/commit/45e7fa49b7dbbaf841fcdb752c03eb0802fa7c6d))

# [1.1.0-beta.1](https://github.com/LuisFernando12/Authenticator/compare/v1.0.0...v1.1.0-beta.1) (2026-03-25)

### Bug Fixes

- **release:** rename realease.config.js to release.config.js ([45e7fa4](https://github.com/LuisFernando12/Authenticator/commit/45e7fa49b7dbbaf841fcdb752c03eb0802fa7c6d))

### Features

- add Husky, Commitlint, and ESLint flat config ([7d72c5c](https://github.com/LuisFernando12/Authenticator/commit/7d72c5c518c5e366f339fa974abdc86e19c97b1c))
