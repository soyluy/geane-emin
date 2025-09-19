# 📦 Codebase

## 🚀 Running Locally (In Progress)

### 🛠️ MongoDB Setup

**First-time setup:**

From the repo root:

```bash
cd docker/mongo
docker build -t geane-mongo .
docker run -d --name geane-mongo -p 27017:27017 geane-mongo
```

**Subsequent runs:**

```bash
docker start geane-mongo
```

---

### ⚡ Redis Setup

**First-time setup:**

From the repo root:

```bash
cd docker/redis
docker build -t geane-redis .
docker run -d --name geane-redis -p 6379:6379 geane-redis
```

**Subsequent runs:**

```bash
docker start geane-redis
```


<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>