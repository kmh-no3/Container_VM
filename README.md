# 開発環境比較検証プロジェクト

## 概要

このプロジェクトは、異なる開発環境（Native、Docker、VM）での開発パターンを比較検証することを目的としています。現在は、Native環境とDocker環境の比較結果をまとめています。

## プロジェクト構造

```
Container_VM/
├── todo-native/          # Native環境での開発
│   ├── index.js         # Express.jsアプリケーション
│   ├── package.json     # Node.js依存関係
│   └── node_modules/    # インストールされたパッケージ
└── todo-docker/         # Docker環境での開発
    ├── index.js         # Express.jsアプリケーション
    ├── package.json     # Node.js依存関係
    ├── Dockerfile       # コンテナ化設定
    ├── docker-compose.yml # マルチコンテナ設定
    └── node_modules/    # インストールされたパッケージ
```

## アプリケーション仕様

両環境とも同じTODOアプリケーションを実装：

- **フレームワーク**: Express.js
- **データベース**: PostgreSQL
- **API エンドポイント**:
  - `GET /todos`: TODO一覧取得
  - `POST /todos`: 新しいTODO作成
- **ポート**: 3000番

## 環境別比較結果

### 1. セットアップと初期化

#### Native環境 (`todo-native`)
```bash
# 必要なソフトウェアのインストール
brew install postgresql
brew services start postgresql

# プロジェクト初期化
npm init -y
npm install express pg

# データベース設定
createdb todo_app
psql -d todo_app -c "CREATE TABLE todos (id SERIAL PRIMARY KEY, task TEXT);"
```

#### Docker環境 (`todo-docker`)
```bash
# 必要なソフトウェアのインストール
# Docker Desktopのみ必要

# プロジェクト初期化
npm init -y
npm install express pg

# コンテナ化設定
# Dockerfileとdocker-compose.ymlを作成
```

### 2. 起動方法

#### Native環境
```bash
cd todo-native
node index.js
# Running on http://localhost:3000
```

#### Docker環境
```bash
cd todo-docker
docker compose up --build
# アプリケーションとデータベースが同時起動
```

### 3. 詳細比較

| 項目 | Native環境 | Docker環境 |
|------|------------|------------|
| **セットアップの複雑さ** | 中（OS依存の設定が必要） | 低（Dockerのみ） |
| **環境の一貫性** | 低（OS依存） | 高（コンテナ化） |
| **依存関係管理** | 手動（brew、npm） | 自動（Dockerfile） |
| **データベース設定** | 手動（PostgreSQL設定） | 自動（docker-compose） |
| **起動時間** | 短（直接実行） | 中（コンテナビルド） |
| **リソース使用量** | 低（直接実行） | 中（コンテナオーバーヘッド） |
| **開発者体験** | シンプル | 統一された環境 |
| **本番環境との差異** | 大（環境依存） | 小（コンテナ化） |

### 4. メリット・デメリット

#### Native環境

**メリット:**
- シンプルなセットアップ
- 高速な起動
- リソース使用量が少ない
- 直接的なデバッグが可能

**デメリット:**
- OS依存の設定が必要
- 環境の一貫性が保ちにくい
- チーム間での環境差異が生じやすい
- 本番環境との差異が大きい

#### Docker環境

**メリット:**
- 環境の一貫性が高い
- 依存関係の管理が自動化
- チーム間での環境統一が容易
- 本番環境との差異が小さい
- マイクロサービスアーキテクチャに適している

**デメリット:**
- 学習コストが高い
- コンテナオーバーヘッド
- ビルド時間がかかる
- デバッグが複雑になる場合がある

### 5. パフォーマンス比較

#### 起動時間
- **Native**: ~1秒（直接実行）
- **Docker**: ~30秒（初回ビルド時）、~5秒（2回目以降）

#### メモリ使用量（実測値）
- **Native**: ~38MB（Node.js + Express）
- **Docker**: ~38MB（アプリコンテナ20MB + DBコンテナ18MB）

#### ディスク使用量（実測値）
- **Native**: ~4.7MB（プロジェクト全体、node_modules: 4.6MB）
- **Docker**: ~846MB（アプリイメージ196MB + PostgreSQLイメージ650MB）

#### 測定方法
- **メモリ使用量**: `ps aux | grep node`（Native）、`docker stats --no-stream`（Docker）
- **ディスク使用量**: `du -sh .`（Native）、`docker system df`（Docker）

### 6. 開発ワークフロー

#### Native環境
1. ローカルにNode.jsとPostgreSQLをインストール
2. プロジェクトディレクトリで依存関係をインストール
3. データベースを手動で設定
4. アプリケーションを直接実行

#### Docker環境
1. Docker Desktopをインストール
2. プロジェクトディレクトリで`docker compose up`
3. アプリケーションとデータベースが自動で起動
4. コンテナ内でアプリケーションが実行

### 7. トラブルシューティング

#### Native環境でよくある問題
- PostgreSQLの起動失敗
- ポート競合
- 依存関係のバージョン不一致
- OS固有の設定問題

#### Docker環境でよくある問題
- Dockerデーモンの起動失敗
- イメージビルドエラー
- コンテナ間の通信問題
- ボリュームマウントの問題

### 8. 推奨用途

#### Native環境が適している場合
- 個人開発・学習
- シンプルなプロトタイプ
- リソースが限られた環境
- 高速な開発サイクルが必要

#### Docker環境が適している場合
- チーム開発
- マイクロサービスアーキテクチャ
- CI/CDパイプライン
- 本番環境との一貫性が重要
- 複数のサービスを統合

## 結論

両環境とも同じTODOアプリケーションを正常に動作させることができましたが、開発体験と運用面で大きな違いがあります。

- **Native環境**は、シンプルで高速な開発に適しており、個人開発や学習用途に最適です。
- **Docker環境**は、チーム開発や本番環境との一貫性が重要な場合に適しており、現代的な開発プラクティスに合致しています。

次回は、VM環境での開発パターンも追加し、3つの環境を包括的に比較する予定です。

## 今後の予定

- [ ] VM環境での開発パターン実装
- [ ] 3環境の包括的比較
- [ ] パフォーマンスベンチマーク
- [ ] セキュリティ比較
- [ ] 運用コスト比較
