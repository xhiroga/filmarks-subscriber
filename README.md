# Filmarks Subscriber

Subscribe Filmarks clips (and post it to Discord).

## Development

```bash
# Dev Contaienr: Open Folder in Container
# Enable App Script API from <https://script.google.com/home/usersettings>

clasp login
clasp create --type sheets # Not required for clone
clasp pull
# Note: .clasp.json is for @xhiroga. to clone this repo, replace it.
# open <https://script.google.com/home/> and check script created

npx jest --init # Not required for clone
# edit jest.config.js to use ts-jest
npx jest

clasp push
# Set trigger
```

## References

- [GAS | clasp、TypeScriptで開発する方法 - わくわくBank](https://www.wakuwakubank.com/posts/875-gas-clasp-typescript/)
- [Filmarksから特定ユーザーの観た映画一覧を取得するスクリプト #GoogleAppsScript - Qiita](https://qiita.com/nkjzm/items/19d8a38301da3a6ee343)
- [TypescriptのGASをJestでテストする - アクトインディ開発者ブログ](https://tech.actindi.net/2019/07/03/081258)
