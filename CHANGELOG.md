# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.13.0"></a>
# [0.13.0](https://github.com/Falinor/baby-foot-api/compare/v0.12.0...v0.13.0) (2018-03-12)


### Features

* **config:** rework URL config ([4f54bec](https://github.com/Falinor/baby-foot-api/commit/4f54bec))
* **player:** implement create function; implement mapper ([1679bcd](https://github.com/Falinor/baby-foot-api/commit/1679bcd))



<a name="0.12.0"></a>
# [0.12.0](https://github.com/Falinor/baby-foot-api/compare/v0.11.0...v0.12.0) (2018-02-18)


### Bug Fixes

* **container:** remove missing content type middleware ([12f7766](https://github.com/Falinor/baby-foot-api/commit/12f7766))


### Features

* **app:** externalize error handler ([0dbe0a3](https://github.com/Falinor/baby-foot-api/commit/0dbe0a3))
* **config:** type cast some config properties ([e39d6cb](https://github.com/Falinor/baby-foot-api/commit/e39d6cb))
* **index:** use scopePerRequest from utils module ([13245bb](https://github.com/Falinor/baby-foot-api/commit/13245bb))
* **utils:** externalize scopePerRequest function in an utility module ([350af2e](https://github.com/Falinor/baby-foot-api/commit/350af2e))



<a name="0.11.0"></a>
# [0.11.0](https://github.com/Falinor/baby-foot-api/compare/v0.10.0...v0.11.0) (2018-02-16)


### Bug Fixes

* **config:** replace http by mongodb protocol ([8017deb](https://github.com/Falinor/baby-foot-api/commit/8017deb))
* **index:** app now starts correctly ([1fbab79](https://github.com/Falinor/baby-foot-api/commit/1fbab79))
* **match:** pass use cases per request ([d1fcb88](https://github.com/Falinor/baby-foot-api/commit/d1fcb88))


### Features

* **config:** add DB_NAME environment variable ([792f130](https://github.com/Falinor/baby-foot-api/commit/792f130))
* **config:** add DB_URL default value ([09fa619](https://github.com/Falinor/baby-foot-api/commit/09fa619))
* **container:** add player and team repositories ([c9eef01](https://github.com/Falinor/baby-foot-api/commit/c9eef01))
* **container:** register elements manually to avoid errors ([46760b1](https://github.com/Falinor/baby-foot-api/commit/46760b1))
* **index:** update entrypoint ([0cfdff6](https://github.com/Falinor/baby-foot-api/commit/0cfdff6))
* **match:** add routing ([3ee3fc7](https://github.com/Falinor/baby-foot-api/commit/3ee3fc7))
* **match:** split parameters proxy in a sequence of parameters ([5d99bd3](https://github.com/Falinor/baby-foot-api/commit/5d99bd3))



<a name="0.10.0"></a>
# [0.10.0](https://github.com/Falinor/baby-foot-api/compare/v0.9.0...v0.10.0) (2018-02-10)


### Bug Fixes

* **container:** resolution module from cwd is now relative to container path ([ced02b7](https://github.com/Falinor/baby-foot-api/commit/ced02b7))


### Features

* **config:** add app host ([9428009](https://github.com/Falinor/baby-foot-api/commit/9428009))
* **config:** DB_URL variable is now optional ([ecf2d06](https://github.com/Falinor/baby-foot-api/commit/ecf2d06))
* **match:** add find-matches use case ([90d9948](https://github.com/Falinor/baby-foot-api/commit/90d9948))
* **match:** add match repository ([bf430ee](https://github.com/Falinor/baby-foot-api/commit/bf430ee))
* **match:** add routes; add controller ([a462930](https://github.com/Falinor/baby-foot-api/commit/a462930))
* **match:** implement match mapping to entity and to DBO ([7ce51e4](https://github.com/Falinor/baby-foot-api/commit/7ce51e4))
* **match:** update create-match use case ([5891611](https://github.com/Falinor/baby-foot-api/commit/5891611))
* **match:** update repository; add lifetime to container registrations ([8317641](https://github.com/Falinor/baby-foot-api/commit/8317641))
* **team:** add team repository ([a932093](https://github.com/Falinor/baby-foot-api/commit/a932093))



<a name="0.9.0"></a>
# [0.9.0](https://github.com/Falinor/baby-foot-api/compare/v0.8.1...v0.9.0) (2018-01-30)


### Features

* **app:** add error handler; add content type middleware ([a20e1a2](https://github.com/Falinor/baby-foot-api/commit/a20e1a2))
* **config:** review config ([1365ff0](https://github.com/Falinor/baby-foot-api/commit/1365ff0))
* **container:** add registrations to DI container ([33ea270](https://github.com/Falinor/baby-foot-api/commit/33ea270))
* **index:** add application entrypoint ([2466cb2](https://github.com/Falinor/baby-foot-api/commit/2466cb2))
* **match:** add create-match use case ([30ec6ae](https://github.com/Falinor/baby-foot-api/commit/30ec6ae))
* **match:** complete create-match use case ([0d99217](https://github.com/Falinor/baby-foot-api/commit/0d99217))
* **match:** implement create-match use case ([0c93385](https://github.com/Falinor/baby-foot-api/commit/0c93385))



<a name="0.8.1"></a>
## [0.8.1](https://github.com/Falinor/baby-foot-api/compare/v0.8.0...v0.8.1) (2018-01-22)



<a name="0.8.0"></a>
# [0.8.0](https://github.com/Falinor/baby-foot-api/compare/v0.7.2...v0.8.0) (2018-01-22)


### Features

* **api:** massive refactor ([b37c598](https://github.com/Falinor/baby-foot-api/commit/b37c598))
* **app:** remove parameters from constructor ([95dfdeb](https://github.com/Falinor/baby-foot-api/commit/95dfdeb))
* **container:** add container and registrations ([caaba38](https://github.com/Falinor/baby-foot-api/commit/caaba38))
* **interfaces:** add app ([c713b00](https://github.com/Falinor/baby-foot-api/commit/c713b00))
