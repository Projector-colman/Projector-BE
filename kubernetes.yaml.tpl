apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: projector-backend
  name: projector-backend
  namespace: projector
spec:
  selector:
    matchLabels:
      app: projector-backend
  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
    type: RollingUpdate
  template:
    metadata:
      labels:
        app: projector-backend
    spec:
      containers:
      - image: cr.io/GOOGLE_CLOUD_PROJECT/projector-fe:COMMIT_SHA
        name: projector-be
        ports:
        - containerPort: 5000
          protocol: TCP
        resources:
          requests:
              memory: "50Mi"
              cpu: "50m"
          limits:
              memory: "250Mi"
              cpu: "250m"