# APPLICATION FLAGS
LOG_LEVEL="INFO"
DEPLOYMENT_NAME="prod"
ENV_NAME="prod"
LOCAL_SETTINGS_MODULES=
ENABLE_STATSD=1
STATSD_HOST='influxdb-1.placer.team'
STATSD_PORT=8125
STATSD_METRIC_PREFIX="prod.services.<%=projectNameUnderscore%>"

# CONNECTION STRINGS
SENTRY_EVENTS_LOG_LEVEL='ERROR'
SENTRY_DSN={{ key "dashboard_be_services/prod/sentry_dsn_server" }}
SENTRY_ENV="<%=projectNameHyphen%>-prod"
CORS_ORIGINS = "https://analytics.placer.ai,https://placer.ai,https://www.placer.ai,https://preproduction-analytics.placer.team"

