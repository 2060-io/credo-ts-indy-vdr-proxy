# indy-vdr-proxy-server-chart

## 🛍️ Overview

This Helm chart deploys the `indy-vdr-proxy` application and its optional companion service `app-check-proxy`. It includes:

- **StatefulSet**: Main application container with optional app-check-proxy sidecar.
- **Service**: Exposes HTTP and optionally App Check endpoints.
- **Ingress**: Routes external traffic based on configuration.
- **ConfigMap**: Defines runtime configurations such as `app.config.json` and (optionally) `ENDPOINT_URLS`.

---

## 📁 Chart Structure

```
indy-vdr-proxy-server-chart/
├── Chart.yaml
├── values.yaml
└── templates/
    ├── _helpers.tpl
    ├── deployment.yaml
```

- `Chart.yaml`: Chart metadata.
- `values.yaml`: Centralized configuration file (all logic controlled from here).
- `templates/`: All Kubernetes manifests, conditionally rendered using Helm logic.

---

## 🚀 Installation

### 1. Lint the Chart

```bash
helm lint ./deployments/indy-vdr-proxy-server
```

### 2. Render Templates (preview output)

```bash
helm template indy-vdr ./deployments/indy-vdr-proxy-server --namespace <your-namespace>
```

### 3. Dry-Run Installation

```bash
helm install --dry-run --debug indy-vdr ./deployments/indy-vdr-proxy-server --namespace <your-namespace>
```

### 4. Install the Chart

```bash
helm install indy-vdr ./deployments/indy-vdr-proxy-server --namespace <your-namespace>
```

> If the namespace doesn't exist, create it manually or configure `createNamespace` in your Helm pipeline logic.

---

## ⚙️ Configuration

All configuration is centralized in `values.yaml`.

### 🌐 Global

```yaml
global:
  domain: dev.2060.io
```

### 📦 Application

```yaml
app:
  name: indy-vdr-proxy
```

### 🏗️ StatefulSet

- Fully configurable image, resources, replicas.
- Includes support for optional `app-check-proxy` sidecar.

```yaml
statefulset:
  replicas: 1
  containerName: indy-vdr-proxy-container
  image:
    repository: io2060/indy-vdr-proxy
    tag: dev
    pullPolicy: Always
  env:
    INDY_VDR_PROXY_PORT: "3000"
    INDY_VDR_PROXY_CONFIG_PATH: "/config/vdr-proxy/app.config.json"
```

### ✅ App Check Proxy (optional sidecar)

```yaml
appCheckProxy:
  enabled: true
  name: app-check-proxy-container
  image:
    repository: io2060/app-check-proxy
    tag: dev
    pullPolicy: Always
  env:
    APP_PORT: "3100"
    FIREBASE_CFG_FILE: "/config/app-check-proxy/firebase-cfg.json"
```

If disabled, the following are skipped:

- Sidecar container
- App Check port in service and ingress
- `ENDPOINT_URLS` from ConfigMap

### 🧹 ConfigMap

Includes two key files:

- `app.config.json` (always rendered)
- `ENDPOINT_URLS` (only rendered if `appCheckProxy.enabled: true`)

Uses `tpl` to support inline template logic from `values.yaml`.

```yaml
configMap:
  appConfigJson: |
    {
      "some": "config"
    }
  endpointUrls: |
    {
      "verana:gov": "https://verana.gov/endpoint"
    }
```

### 🌐 Ingress

```yaml
ingress:
  enabled: true
  name: indy-vdr-proxy
  className: nginx
  host: "indyvdrproxy.ca.{{ .Values.global.domain }}"
  tlsSecretName: "indyvdrproxy.ca.{{ .Values.global.domain }}-cert"
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
```

> The ingress backend port is dynamically selected depending on whether `appCheckProxy` is enabled.

### 📡 Service

Exposes two ports if `appCheckProxy.enabled: true`, otherwise only HTTP.

```yaml
service:
  ports:
    http: 3000
    appCheck: 3100
```

---

## 🔄 Uninstalling

```bash
helm uninstall indy-vdr --namespace <your-namespace>
```
